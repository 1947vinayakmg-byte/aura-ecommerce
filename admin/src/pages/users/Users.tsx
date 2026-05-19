import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  UserPlus,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../../utils/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  avatar: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Alexander Vane', email: 'vane@aura.com', role: 'admin', status: 'active', lastLogin: '2 mins ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop' },
  { id: '2', name: 'Elena Rossi', email: 'rossi@aura.com', role: 'editor', status: 'active', lastLogin: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' },
  { id: '3', name: 'Marcus Thorne', email: 'thorne@aura.com', role: 'viewer', status: 'inactive', lastLogin: '2 days ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' },
  { id: '4', name: 'Sophia Chen', email: 'chen@aura.com', role: 'customer', status: 'active', lastLogin: '5 mins ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' },
  { id: '5', name: 'Julian Drake', email: 'drake@aura.com', role: 'editor', status: 'suspended', lastLogin: '1 month ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop' },
];

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'customer'>('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="flex items-center gap-1.5 text-green-400 text-[10px] font-bold uppercase tracking-widest"><CheckCircle2 size={12} /> Active</span>;
      case 'inactive': return <span className="flex items-center gap-1.5 text-luxury-text-secondary text-[10px] font-bold uppercase tracking-widest"><Clock size={12} /> Inactive</span>;
      case 'suspended': return <span className="flex items-center gap-1.5 text-red-400 text-[10px] font-bold uppercase tracking-widest"><XCircle size={12} /> Suspended</span>;
      default: return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <span className="px-2 py-0.5 rounded bg-luxury-gold/10 text-luxury-gold text-[9px] font-bold uppercase tracking-widest border border-luxury-gold/20">Admin</span>;
      case 'editor': return <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase tracking-widest border border-blue-500/20">Editor</span>;
      case 'viewer': return <span className="px-2 py-0.5 rounded bg-white/5 text-luxury-text-secondary text-[9px] font-bold uppercase tracking-widest border border-white/10">Viewer</span>;
      case 'customer': return <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[9px] font-bold uppercase tracking-widest border border-purple-500/20">Customer</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold">Client & Team Registry</h1>
          <p className="text-luxury-text-secondary text-sm">Manage administrative access and luxury client profiles.</p>
        </div>

        <button className="luxury-button-primary flex items-center gap-2">
          <UserPlus size={18} /> INVITE MEMBER
        </button>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white/[0.03] border border-luxury-border rounded-xl p-1 w-fit">
          {['all', 'admin', 'customer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-luxury-gold text-black" : "text-luxury-text-secondary hover:text-white"
              )}
            >
              {tab}s
            </button>
          ))}
        </div>

        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary group-focus-within:text-luxury-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or role..." 
            className="w-full luxury-input pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-luxury-border bg-white/[0.01]">
                <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest">Access Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest">Last Activity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {mockUsers.map((user, idx) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-luxury-border p-0.5" />
                        {user.status === 'active' && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-luxury-card" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-luxury-gold transition-colors">{user.name}</p>
                        <p className="text-xs text-luxury-text-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 text-xs text-luxury-text-secondary">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-luxury-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-luxury-border flex items-center justify-between bg-white/[0.01]">
          <p className="text-xs text-luxury-text-secondary">Showing <span className="text-white font-bold">5</span> of <span className="text-white font-bold">1,240</span> members</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-luxury-border text-xs font-bold text-luxury-text-secondary hover:text-white hover:bg-white/5 disabled:opacity-50" disabled>PREVIOUS</button>
            <button className="px-3 py-1.5 rounded-lg border border-luxury-border text-xs font-bold text-luxury-text-secondary hover:text-white hover:bg-white/5">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
