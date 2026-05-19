import React from 'react';
import { motion } from 'motion/react';
import { Mail, Shield, MoreHorizontal, User as UserIcon, Calendar, IndianRupee, ShoppingBag } from 'lucide-react';
import { User } from '../../types/user';
import { Table, THead, TBody, TR, TH, TD } from '../common/Tables';
import { cn } from '../../utils/cn';
import Button from '../common/Button';

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit }) => {
  const statusColors = {
    active: 'bg-green-500/10 text-green-500',
    inactive: 'bg-luxury-gold/10 text-luxury-gold',
    suspended: 'bg-red-500/10 text-red-500',
  };

  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <THead>
          <TR>
            <TH>Customer</TH>
            <TH>Status</TH>
            <TH>Role</TH>
            <TH>Orders</TH>
            <TH>Total Spent</TH>
            <TH>Last Login</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group hover:bg-white/[0.02] transition-colors"
            >
              <TD>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-luxury-border group-hover:border-luxury-gold/50 transition-colors">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-luxury-text-secondary">
                          <UserIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#121212]",
                      user.status === 'active' ? 'bg-green-500' : 'bg-luxury-text-secondary'
                    )} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user.name}</div>
                    <div className="text-xs text-luxury-text-secondary">{user.email}</div>
                  </div>
                </div>
              </TD>
              <TD>
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-transparent",
                  statusColors[user.status]
                )}>
                  {user.status}
                </span>
              </TD>
              <TD>
                <div className="flex items-center gap-2 text-luxury-text-secondary">
                  <Shield size={14} className={user.role === 'admin' ? 'text-luxury-gold' : ''} />
                  <span className="text-xs font-medium uppercase">{user.role}</span>
                </div>
              </TD>
              <TD>
                <div className="flex items-center gap-2 text-luxury-text-secondary">
                  <ShoppingBag size={14} />
                  <span className="text-sm font-medium">{user.totalOrders}</span>
                </div>
              </TD>
              <TD className="font-bold text-white">₹{user.totalSpent.toLocaleString()}</TD>
              <TD className="text-xs text-luxury-text-secondary font-mono">
                {user.lastLogin || 'Never'}
              </TD>
              <TD className="text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(user)} className="w-8 h-8">
                    <Mail size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </TD>
            </motion.tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default UserTable;
