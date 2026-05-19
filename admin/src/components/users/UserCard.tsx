import React from 'react';
import { motion } from 'motion/react';
import { Mail, ShoppingBag, IndianRupee, User as UserIcon, Settings, ExternalLink } from 'lucide-react';
import { User } from '../../types/user';
import Button from '../common/Button';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden group"
    >
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-luxury-gold/10 to-transparent -z-10" />
      
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full border-2 border-luxury-gold/30 p-1 group-hover:border-luxury-gold transition-colors duration-500">
          <div className="w-full h-full rounded-full overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center text-luxury-text-secondary">
                <UserIcon size={32} />
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#121212]" />
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-xl font-display font-bold text-white group-hover:text-luxury-gold transition-colors">{user.name}</h3>
        <p className="text-sm text-luxury-text-secondary">{user.email}</p>
        <div className="pt-2">
          <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-[10px] font-bold uppercase tracking-widest rounded-full border border-luxury-gold/20">
            {user.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        <div className="p-3 bg-white/5 rounded-2xl border border-luxury-border">
          <div className="flex items-center justify-center gap-2 text-luxury-gold mb-1">
            <ShoppingBag size={14} />
            <span className="text-xs font-bold uppercase tracking-tighter">Orders</span>
          </div>
          <p className="text-lg font-bold text-white">{user.totalOrders}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-luxury-border">
          <div className="flex items-center justify-center gap-2 text-luxury-gold mb-1">
            <IndianRupee size={14} />
            <span className="text-xs font-bold uppercase tracking-tighter">Spent</span>
          </div>
          <p className="text-lg font-bold text-white">₹{user.totalSpent.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full">
        <Button variant="secondary" size="sm" className="flex-1 gap-2">
          <Mail size={14} /> Message
        </Button>
        <Button variant="ghost" size="icon" className="rounded-xl border border-luxury-border">
          <Settings size={16} />
        </Button>
      </div>
      
      <button className="absolute top-4 right-4 text-luxury-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink size={16} />
      </button>
    </motion.div>
  );
};

export default UserCard;
