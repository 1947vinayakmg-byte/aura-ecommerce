import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import RecentOrders from '../../components/dashboard/RecentOrders';
import TopProducts from '../../components/dashboard/TopProducts';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  TrendingUp,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Loader2,
  X
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { getDashboardStats } from '../../services/adminService';

const miniChartData = [
  { value: 10 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 20 }, { value: 40 }, { value: 35 }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueFlow: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchStats();

    // Real-time polling every 10 seconds
    const intervalId = setInterval(fetchStats, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);



  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl p-10 bg-[#121212] border border-luxury-border">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
              <Sparkles size={12} />
              Luxury Performance Active
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">
              Welcome to the <span className="gold-gradient-text italic">Elite Console.</span>
            </h2>
            <p className="text-luxury-text-secondary font-luxury text-lg leading-relaxed">
              Your luxury fashion empire is performing beautifully. Revenue is currently <span className="text-luxury-gold font-bold">₹{(stats.totalRevenue || 0).toLocaleString()}</span> and customer engagement is at an all-time high.
            </p>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/products/add')}
              className="bg-luxury-gold hover:bg-luxury-gold-hover text-black px-8 py-4 rounded-2xl font-luxury font-bold transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:-translate-y-1"
            >
              <PlusCircle size={20} />
              ADD NEW MASTERPIECE
            </button>
            <button 
              onClick={() => navigate('/ai-insights')}
              className="bg-white/[0.05] hover:bg-white/[0.1] text-luxury-text-primary border border-luxury-border px-8 py-4 rounded-2xl font-luxury font-bold transition-all flex items-center gap-3 backdrop-blur-md"
            >
              VIEW AI INSIGHTS
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/90 to-transparent" />
        <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-luxury-gold/10 blur-[150px] rounded-full animate-pulse" />
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
          change={12.5}
          icon={IndianRupee}
          trend="up"
        />
        <StatCard
          title="Total Orders"
          value={(stats.totalOrders || 0).toLocaleString()}
          change={8.2}
          icon={ShoppingBag}
          trend="up"
        />
        <StatCard
          title="Active Customers"
          value={(stats.totalUsers || 0).toLocaleString()}
          change={15.4}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Avg Order Value"
          value={`₹${(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          change={3.2}
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Main Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart data={stats.revenueFlow} />
          <RecentOrders />
        </div>
        
        <div className="space-y-8">
          <TopProducts />
          
          {/* Quick Stats Card */}
          <div className="glass-card p-8 bg-luxury-gold/5 border-luxury-gold/20">
            <h3 className="text-xl font-display font-bold text-luxury-gold mb-6 flex items-center gap-2">
              <Sparkles size={20} />
              Live Insights
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-luxury-gold/10 pb-4">
                <div>
                  <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest mb-1">Current Traffic</p>
                  <p className="text-2xl font-display font-bold text-white">482 <span className="text-xs text-luxury-text-secondary font-medium">Browsing Now</span></p>
                </div>
                <div className="flex gap-1 items-end h-10">
                  {[4,7,3,9,5,8,4].map((h, i) => (
                    <div key={i} className="w-1.5 bg-luxury-gold/40 rounded-full" style={{ height: `${h * 10}%` }} />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-luxury-gold/10 pb-4">
                <div>
                  <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest mb-1">Active Carts</p>
                  <p className="text-2xl font-display font-bold text-white">124</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white font-bold">₹42,850</p>
                  <p className="text-[10px] text-luxury-text-secondary">Potential Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}


