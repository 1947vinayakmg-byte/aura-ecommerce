import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data?: { name: string; value: number }[];
}

const defaultData = [
  { name: 'Mon', value: 4500 },
  { name: 'Tue', value: 5200 },
  { name: 'Wed', value: 4800 },
  { name: 'Thu', value: 6100 },
  { name: 'Fri', value: 5500 },
  { name: 'Sat', value: 6700 },
  { name: 'Sun', value: 7200 },
];

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="glass-card p-8 h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Revenue Overview</h3>
          <p className="text-sm text-luxury-text-secondary">Real-time daily transaction tracking (Last 7 Days)</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest bg-white/5 border border-luxury-border rounded-lg px-3 py-1.5">
          <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse" /> LIVE STREAMING
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#AFAFAF', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#AFAFAF', fontSize: 12 }} 
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#161616', 
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                color: '#fff'
              }}
              itemStyle={{ color: '#D4AF37' }}
              formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#D4AF37" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRev)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
