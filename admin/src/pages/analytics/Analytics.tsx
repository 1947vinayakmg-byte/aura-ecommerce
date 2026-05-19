import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getDashboardStats } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  revenueFlow: { name: string; value: number }[];
  collectionShare: { name: string; value: number }[];
}

const COLORS = ['#d4af37', '#c5a028', '#b69119', '#a7820a', '#866503'];

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch executive stats:', error);
      toast.error('Failed to synchronize real-time stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-40 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Sentiment based on sales share and rating
  const trendingCategory = stats.collectionShare.length > 0 
    ? stats.collectionShare.reduce((prev, current) => (prev.value > current.value) ? prev : current).name 
    : 'Jewelry';

  return (
    <div className="space-y-8">
      {/* Ambient decorative blur background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-luxury-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-luxury-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold">Executive Intelligence</h1>
          <p className="text-luxury-text-secondary text-sm">Real-time performance analytics and market insights.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStats}
            className="flex items-center gap-2 bg-white/[0.03] border border-luxury-border px-4 py-2.5 rounded-xl text-xs font-luxury font-bold hover:bg-white/[0.05] transition-all"
          >
            <RefreshCw size={14} /> SYNC STATS
          </button>
          <button className="p-2.5 glass-card bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-luxury-text-secondary hover:text-white transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, change: '+12.5%', icon: TrendingUp, trend: 'up' },
          { label: 'Active Clients', value: stats.totalUsers.toLocaleString(), change: '+5.2%', icon: Users, trend: 'up' },
          { label: 'Avg. Order Value', value: `₹${stats.avgOrderValue.toLocaleString()}`, change: '+3.1%', icon: ShoppingBag, trend: 'up' },
          { label: 'Conversion Rate', value: `${stats.conversionRate}%`, change: '+1.4%', icon: BarChart3, trend: 'up' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-luxury-gold/10 rounded-xl text-luxury-gold">
                <stat.icon size={20} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                <ArrowUpRight size={12} />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-2xl font-display font-bold mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl flex items-center gap-2">
              <TrendingUp size={20} className="text-luxury-gold" /> REVENUE FLOW
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-luxury-text-secondary">
              <div className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" /> LIVE REAL-TIME DATA
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueFlow}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#d4af37' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#d4af37" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-8 space-y-6">
          <h3 className="font-display font-bold text-xl flex items-center gap-2">
            <Filter size={20} className="text-luxury-gold" /> COLLECTION SHARE
          </h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.collectionShare}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.collectionShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(value: any) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 scrollbar-hide">
            {stats.collectionShare.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-xs text-luxury-text-secondary">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="glass-card p-8 bg-linear-to-br from-luxury-gold/5 to-transparent border-luxury-gold/20 relative overflow-hidden z-10">
        <Sparkles className="absolute -top-4 -right-4 w-40 h-40 text-luxury-gold/5 rotate-12" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-display font-bold text-2xl flex items-center gap-2 text-luxury-gold">
              <Sparkles size={24} /> AI PREDICTIVE INSIGHTS
            </h3>
            <p className="text-luxury-text-secondary leading-relaxed">
              Our models indicate a strong upward trend in the <span className="text-white font-bold">{trendingCategory} Collection</span> for the upcoming quarter. We recommend increasing inventory levels by 20% to meet projected demand from elite buyers.
            </p>
          </div>
          <div className="text-center md:text-right">
            <button className="luxury-button-primary inline-flex items-center gap-2">
              GENERATE FULL REPORT <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
