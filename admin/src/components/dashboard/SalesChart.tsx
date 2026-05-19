import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', sales: 40 },
  { name: 'Tue', sales: 30 },
  { name: 'Wed', sales: 60 },
  { name: 'Thu', sales: 45 },
  { name: 'Fri', sales: 90 },
  { name: 'Sat', sales: 120 },
  { name: 'Sun', sales: 80 },
];

const SalesChart: React.FC = () => {
  return (
    <div className="glass-card p-8 h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Daily Sales</h3>
          <p className="text-sm text-luxury-text-secondary">Transactions per day this week</p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{ 
                backgroundColor: '#161616', 
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
              }}
            />
            <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 5 ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'} 
                  className="transition-all duration-300 hover:fill-luxury-gold-hover"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
