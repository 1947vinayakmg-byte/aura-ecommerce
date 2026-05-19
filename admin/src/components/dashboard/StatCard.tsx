import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex flex-col justify-between group overflow-hidden relative"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="p-3 bg-luxury-gold/10 rounded-2xl text-luxury-gold group-hover:bg-luxury-gold group-hover:text-black transition-colors duration-300">
          <Icon size={24} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg",
          trend === 'up' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}%
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <p className="text-xs font-bold text-luxury-text-secondary uppercase tracking-widest">
          {title}
        </p>
        <h3 className="text-3xl font-display font-bold text-white mt-1">
          {value}
        </h3>
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-luxury-gold/10" />
    </motion.div>
  );
};

export default StatCard;
