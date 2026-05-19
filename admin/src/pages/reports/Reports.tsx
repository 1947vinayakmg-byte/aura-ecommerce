import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Calendar, Download, Printer, TrendingUp, 
  ShoppingBag, CreditCard, RefreshCw, CheckCircle, BarChart3 
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { format, isToday, isWithinInterval, subDays, startOfDay } from 'date-fns';
import * as XLSX from 'xlsx';

interface OrderItem {
  product: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface Order {
  _id: string;
  user?: { name: string; email: string };
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  status: string;
  orderItems: OrderItem[];
  createdAt: string;
}

export default function Reports() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today');

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load reports data:', error);
      if (!silent) toast.error('Failed to compile report transactions');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);

    // Real-time polling every 10 seconds
    const intervalId = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Filter orders based on the selected range with safe timestamp arithmetic
  const filteredOrders = orders.filter(order => {
    const orderTime = new Date(order.createdAt).getTime();
    const now = Date.now();
    
    if (range === 'today') {
      return isToday(new Date(order.createdAt)) && order.status !== 'Cancelled';
    } else if (range === 'week') {
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      return orderTime >= sevenDaysAgo && orderTime <= now && order.status !== 'Cancelled';
    } else {
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      return orderTime >= thirtyDaysAgo && orderTime <= now && order.status !== 'Cancelled';
    }
  });

  // Calculate Metrics
  const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.totalPrice, 0);
  const totalOrdersCount = filteredOrders.length;
  
  // Total products sold quantity
  const totalProductsSold = filteredOrders.reduce((acc, o) => {
    const itemsCount = o.orderItems?.reduce((sum, item) => sum + item.qty, 0) || 0;
    return acc + itemsCount;
  }, 0);

  // Payments split
  const onlinePaymentsCount = filteredOrders.filter(o => o.paymentMethod?.toUpperCase() !== 'COD').length;
  const codPaymentsCount = filteredOrders.filter(o => o.paymentMethod?.toUpperCase() === 'COD').length;
  
  // Top Selling Items breakdown for report
  const itemizedSales: { [sku: string]: { name: string; qty: number; revenue: number } } = {};
  filteredOrders.forEach(o => {
    o.orderItems?.forEach(item => {
      let productId = '';
      if (item.product) {
        if (typeof item.product === 'object') {
          productId = (item.product as any)._id || '';
        } else {
          productId = item.product;
        }
      }
      const sku = productId ? productId.slice(-6).toUpperCase() : 'UNKNOWN';
      if (!itemizedSales[sku]) {
        itemizedSales[sku] = { name: item.name, qty: 0, revenue: 0 };
      }
      itemizedSales[sku].qty += item.qty;
      itemizedSales[sku].revenue += (item.price * item.qty);
    });
  });

  const topSellingList = Object.keys(itemizedSales).map(sku => ({
    sku,
    name: itemizedSales[sku].name,
    qty: itemizedSales[sku].qty,
    revenue: itemizedSales[sku].revenue
  })).sort((a, b) => b.qty - a.qty);

  // Dynamic File Title
  const getReportTitle = () => {
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    if (range === 'today') return `AURA_Maison_Report_Daily_${dateStr}`;
    if (range === 'week') return `AURA_Maison_Report_Weekly_${dateStr}`;
    return `AURA_Maison_Report_Monthly_${dateStr}`;
  };

  // ─── EXPORT EXCEL: Full multi-sheet .xlsx workbook ───
  const handleExportExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();

      // ── Sheet 1: Executive Summary ──
      const summaryData = [
        { 'Metric': 'Report Scope', 'Value': range.toUpperCase() },
        { 'Metric': 'Exported At', 'Value': format(new Date(), 'yyyy-MM-dd HH:mm') },
        { 'Metric': 'Total Order Volume', 'Value': totalOrdersCount },
        { 'Metric': 'Gross Sales Revenue (INR)', 'Value': totalRevenue },
        { 'Metric': 'Total Products Dispatched', 'Value': totalProductsSold },
        { 'Metric': 'Online Transactions', 'Value': onlinePaymentsCount },
        { 'Metric': 'COD Settlements', 'Value': codPaymentsCount },
      ];
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 34 }, { wch: 26 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

      // ── Sheet 2: Itemized Dispatch Log ──
      const dispatchData = topSellingList.map(item => ({
        'Asset SKU': `SKU-${item.sku}`,
        'Masterpiece Product Name': item.name,
        'Quantity Dispatched': item.qty,
        'Asset Yield Revenue (INR)': item.revenue
      }));
      const dispatchSheet = XLSX.utils.json_to_sheet(dispatchData);
      dispatchSheet['!cols'] = [{ wch: 18 }, { wch: 38 }, { wch: 22 }, { wch: 26 }];
      XLSX.utils.book_append_sheet(workbook, dispatchSheet, 'Itemized Dispatch Log');

      // ── Sheet 3: Customer Acquisition Logs ──
      const acquisitionData = filteredOrders.map(o => ({
        'Order Transaction ID': `#${o._id.slice(-8).toUpperCase()}`,
        'Guest / Client Profile': o.user?.name || 'Private Client',
        'Date Logged': format(new Date(o.createdAt), 'yyyy-MM-dd HH:mm'),
        'Settlement Status': o.isPaid ? 'PAID' : 'UNPAID',
        'Settlement Route': o.paymentMethod || 'COD',
        'Valuation Price (INR)': o.totalPrice
      }));
      const acquisitionSheet = XLSX.utils.json_to_sheet(acquisitionData);
      acquisitionSheet['!cols'] = [
        { wch: 24 }, { wch: 30 }, { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 24 }
      ];
      XLSX.utils.book_append_sheet(workbook, acquisitionSheet, 'Customer Acquisition Logs');

      XLSX.writeFile(workbook, `${getReportTitle()}_Full_Report.xlsx`);
      toast.success('Full Maison Report exported as .xlsx (3 sheets)');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate Excel report');
    }
  };

  // ─── PRINT LEDGER: Open clean browser print window with only Customer Acquisition Logs ───
  const handlePrint = () => {
    const rangeLabel =
      range === 'today' ? "Today's Yield"
      : range === 'week' ? 'Weekly Summary'
      : 'Monthly Summary';

    const rows = filteredOrders.map(o => `
      <tr>
        <td>#${o._id.slice(-8).toUpperCase()}</td>
        <td>${o.user?.name || 'Private Client'}</td>
        <td>${format(new Date(o.createdAt), 'MMM dd, yyyy HH:mm')}</td>
        <td style="color:${o.isPaid ? '#16a34a' : '#d97706'}; font-weight:700">${o.isPaid ? 'PAID' : 'UNPAID'}</td>
        <td>${o.paymentMethod || 'COD'}</td>
        <td style="text-align:right; font-weight:700">₹${o.totalPrice.toLocaleString()}</td>
      </tr>
    `).join('');

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AURA Maison – Customer Acquisition Logs</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 32px; color: #111; background: #fff; }
          .header { border-bottom: 2px solid #111; padding-bottom: 14px; margin-bottom: 20px; }
          .header h1 { font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; }
          .header p { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px; }
          .meta { display: flex; justify-content: space-between; font-size: 10px; color: #555; margin-top: 8px; }
          h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-left: 3px solid #333; padding-left: 10px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          thead tr { background: #f3f3f3; border-top: 1px solid #bbb; border-bottom: 1px solid #bbb; }
          th { padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #444; }
          td { padding: 7px 10px; border-bottom: 1px solid #e5e5e5; color: #222; vertical-align: middle; }
          tr:last-child td { border-bottom: none; }
          .footer { margin-top: 40px; border-top: 1px dashed #bbb; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .sig-line { border-bottom: 1px solid #333; width: 180px; height: 28px; margin-bottom: 4px; }
          .sig-label { font-size: 9px; color: #777; text-transform: uppercase; letter-spacing: 0.1em; }
          .conf { font-size: 8px; color: #aaa; text-align: right; max-width: 260px; }
          @media print { @page { margin: 18mm; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Aura Maison de Luxe</h1>
          <p>Official Customer Acquisition Ledger</p>
          <div class="meta">
            <span>Scope: <strong>${rangeLabel}</strong></span>
            <span>Compiled: <strong>${format(new Date(), 'yyyy-MM-dd HH:mm')}</strong></span>
          </div>
        </div>

        <h2>Customer Acquisition Logs</h2>
        <table>
          <thead>
            <tr>
              <th>Order Transaction ID</th>
              <th>Guest / Client Profile</th>
              <th>Date Logged</th>
              <th>Settlement Status</th>
              <th>Settlement Route</th>
              <th style="text-align:right">Valuation Price</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows : '<tr><td colspan="6" style="text-align:center;padding:20px;color:#999;font-style:italic">No transactions recorded for this period.</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          <div>
            <div class="sig-line"></div>
            <div class="sig-label">Store Director Signature</div>
          </div>
          <div class="conf">Aura Maison de Luxe — Internal Records. Confidential &amp; Non-Transferable.</div>
        </div>

        <script>window.onload = function() { window.print(); }<\/script>
      </body>
      </html>
    `;

    const win = window.open('', '_blank', 'width=900,height=700');
    if (win) {
      win.document.write(printHTML);
      win.document.close();
    } else {
      toast.error('Popup blocked — please allow popups for this site');
    }
  };

  return (
    <div className="space-y-8 print:p-0 print:m-0">
      {/* Background glow - hidden on print */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute top-[10%] left-[5%] w-[35%] h-[35%] bg-luxury-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] bg-luxury-gold/5 rounded-full blur-[120px]" />
      </div>

      {/* Header - hidden on print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 print:hidden">
        <div>
          <h1 className="text-3xl font-display font-bold">Maison Audit & Reports</h1>
          <p className="text-luxury-text-secondary mt-1 text-sm">
            Compile official financial disclosures, payments settlements, and dispatch logistics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white/[0.03] border border-luxury-border px-4 py-2.5 rounded-xl text-xs font-luxury font-bold hover:bg-white/[0.05] transition-all"
          >
            <RefreshCw size={14} /> REFRESH LEDGER
          </button>
          
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-hover text-black px-4 py-2.5 rounded-xl text-xs font-luxury font-bold transition-all shadow-gold hover:-translate-y-0.5"
          >
            <Download size={14} /> EXPORT EXCEL
          </button>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white/5 border border-luxury-border px-4 py-2.5 rounded-xl text-xs font-luxury font-bold hover:bg-white/10 hover:text-white transition-all text-luxury-text-secondary"
          >
            <Printer size={14} /> PRINT LEDGER
          </button>
        </div>
      </div>

      {/* Selection Filters - hidden on print */}
      <div className="relative z-10 flex bg-white/[0.02] border border-luxury-border p-1 rounded-2xl shrink-0 max-w-sm print:hidden">
        {[
          { label: "Today's Yield", value: 'today' },
          { label: 'Weekly Summary', value: 'week' },
          { label: 'Monthly Summary', value: 'month' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRange(tab.value as any)}
            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              range === tab.value 
                ? 'bg-luxury-gold text-black shadow-gold' 
                : 'text-luxury-text-secondary hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader /></div>
      ) : (
        <div className="space-y-8 relative z-10">
          
          {/* Executive summary block hidden when printing */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
            <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] print:bg-transparent print:border-black flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-luxury-text-secondary print:text-gray-500 uppercase tracking-widest mb-1">Maison Yield Revenue</p>
                <p className="text-2xl font-display font-bold text-luxury-gold print:text-black">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold print:hidden">
                <TrendingUp size={18} />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] print:bg-transparent print:border-black flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-luxury-text-secondary print:text-gray-500 uppercase tracking-widest mb-1">Acquisition Volume</p>
                <p className="text-2xl font-display font-bold text-white print:text-black">{totalOrdersCount} Completed</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-luxury-text-secondary print:hidden">
                <ShoppingBag size={18} />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] print:bg-transparent print:border-black flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-luxury-text-secondary print:text-gray-500 uppercase tracking-widest mb-1">Masterpieces Sold</p>
                <p className="text-2xl font-display font-bold text-white print:text-black">{totalProductsSold} Units</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-luxury-text-secondary print:hidden">
                <CheckCircle size={18} />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] print:bg-transparent print:border-black flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-luxury-text-secondary print:text-gray-500 uppercase tracking-widest mb-1">Settlement Routes</p>
                <p className="text-xs font-luxury font-bold text-luxury-gold print:text-black">
                  Online: {onlinePaymentsCount} | COD: {codPaymentsCount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold print:hidden">
                <CreditCard size={18} />
              </div>
            </div>
          </div>

          {/* Main Printable Ledger Area */}
          <div className="space-y-8 bg-white/[0.01] border border-luxury-border rounded-3xl p-8 print:border-none print:p-0">
            
            {/* Report Header for printing */}
            <div className="hidden print:block border-b border-gray-300 pb-4 mb-6">
              <h2 className="text-2xl font-display font-bold text-black uppercase">AURA MAISON DE LUXE</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">OFFICIAL TRANSACTION LEDGER DISCLOSURE</p>
              <div className="flex justify-between text-xs text-gray-600 mt-4">
                <span>Scope: {range.toUpperCase()}</span>
                <span>Compiled: {format(new Date(), 'yyyy-MM-dd HH:mm')}</span>
              </div>
            </div>

            {/* Section 1: Itemized Product Sales (Hidden when printing) */}
            <div className="space-y-4 print:hidden">
              <h3 className="text-lg font-display font-bold text-white print:text-black flex items-center gap-2">
                <BarChart3 size={18} className="text-luxury-gold print:text-black" /> Itemized Dispatch Log
              </h3>
              
              <div className="overflow-hidden border border-luxury-border/50 rounded-2xl print:border-black">
                <table className="w-full text-left border-collapse text-xs print:text-black">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-luxury-border print:bg-gray-100 print:border-black text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest">
                      <th className="py-3 px-6">Asset SKU</th>
                      <th className="py-3 px-6">Masterpiece Product Name</th>
                      <th className="py-3 px-6 text-center">Quantity Dispatched</th>
                      <th className="py-3 px-6 text-right">Asset Yield Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 px-6 text-center text-luxury-text-secondary italic">No products dispatched in selected scope.</td>
                      </tr>
                    ) : (
                      topSellingList.map(item => (
                        <tr key={item.sku} className="border-b border-luxury-border/30 print:border-gray-300">
                          <td className="py-2.5 px-6 font-mono text-[10px] text-luxury-text-secondary print:text-black">SKU-{item.sku}</td>
                          <td className="py-2.5 px-6 font-bold text-white print:text-black">{item.name}</td>
                          <td className="py-2.5 px-6 text-center">{item.qty} Pieces</td>
                          <td className="py-2.5 px-6 text-right font-bold text-white print:text-black">₹{item.revenue.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Detailed Transactions logs */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-display font-bold text-white print:text-black flex items-center gap-2">
                <FileText size={18} className="text-luxury-gold print:text-black" /> Customer Acquisition Logs
              </h3>

              <div className="overflow-hidden border border-luxury-border/50 rounded-2xl print:border-black">
                <table className="w-full text-left border-collapse text-xs print:text-black">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-luxury-border print:bg-gray-100 print:border-black text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest">
                      <th className="py-3 px-6">Order Transaction ID</th>
                      <th className="py-3 px-6">Guest / Client Profile</th>
                      <th className="py-3 px-6">Date Logged</th>
                      <th className="py-3 px-6">Settlement Status</th>
                      <th className="py-3 px-6">Settlement Route</th>
                      <th className="py-3 px-6 text-right">Valuation Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 px-6 text-center text-luxury-text-secondary italic">No guest transactions recorded.</td>
                      </tr>
                    ) : (
                      filteredOrders.map(o => (
                        <tr key={o._id} className="border-b border-luxury-border/30 print:border-gray-300">
                          <td className="py-2.5 px-6 font-mono text-[10px] text-luxury-text-secondary print:text-black">#{o._id.slice(-8).toUpperCase()}</td>
                          <td className="py-2.5 px-6 font-semibold text-white print:text-black">{o.user?.name || 'Private Client'}</td>
                          <td className="py-2.5 px-6 text-luxury-text-secondary print:text-black">{format(new Date(o.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                          <td className="py-2.5 px-6">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] ${
                              o.isPaid ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {o.isPaid ? 'PAID' : 'UNPAID'}
                            </span>
                          </td>
                          <td className="py-2.5 px-6 uppercase tracking-wider text-[10px]">{o.paymentMethod || 'COD'}</td>
                          <td className="py-2.5 px-6 text-right font-bold text-white print:text-black">₹{o.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Footer signature for Print version */}
            <div className="hidden print:flex justify-between items-end pt-12 mt-12 border-t border-dashed border-gray-300">
              <div className="text-center w-48">
                <div className="border-b border-black h-8 mb-1" />
                <p className="text-[10px] text-gray-500 font-bold">STORE DIRECTOR SIGNATURE</p>
              </div>
              <div className="text-right text-[9px] text-gray-400">
                Aura Maison de Luxe Internal Records. Confidential & Non-Transferable.
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
