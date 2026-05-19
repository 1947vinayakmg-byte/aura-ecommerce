import { motion } from 'motion/react';
import { LucideIcon, LogOut, ChevronRight, X, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
  onClose?: () => void;
  className?: string;
}

const DashboardSidebar = ({ items, activeTab, onTabChange, onLogout, onClose, className }: DashboardSidebarProps) => {
  return (
    <div className={cn(
      "w-80 h-screen flex flex-col bg-luxury-dark/30 backdrop-blur-3xl p-12 border-r border-primary/5",
      className
    )}>
      <div className="flex justify-between items-start mb-20">
        <Link to="/" className="group block">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-secondary font-black mb-4 group-hover:text-luxury-gold transition-colors">Elite Portal</h2>
          <div className="text-2xl font-serif italic text-luxury-gold group-hover:text-primary transition-colors">Member Sanctuary</div>
        </Link>
        
        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-secondary hover:text-luxury-gold transition-colors -mt-2"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-4">
        {/* Storefront / Home Button */}
        <Link
          to="/"
          className="w-full flex items-center justify-between group py-4 px-6 rounded-sm transition-all duration-500 relative overflow-hidden text-secondary hover:text-primary hover:bg-primary/5 mb-8 border-b border-primary/5 pb-8"
        >
          <div className="flex items-center gap-4 relative z-10">
            <Home size={18} strokeWidth={1.5} />
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold">Return to Store</span>
          </div>
          <ChevronRight 
            size={14} 
            className="transition-transform duration-500 relative z-10 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" 
          />
        </Link>

        <div className="space-y-4">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (onClose) onClose();
                }}
                className={cn(
                  "w-full flex items-center justify-between group py-4 px-6 rounded-sm transition-all duration-500 relative overflow-hidden",
                  isActive ? "bg-luxury-gold text-black gold-glow" : "text-secondary hover:text-primary hover:bg-primary/5"
                )}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[11px] uppercase tracking-[0.25em] font-bold">{item.label}</span>
                </div>
                <ChevronRight 
                  size={14} 
                  className={cn(
                    "transition-transform duration-500 relative z-10",
                    isActive ? "translate-x-0" : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  )} 
                />
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto pt-12 border-t border-primary/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 py-4 px-6 text-secondary hover:text-red-500 transition-colors uppercase text-[10px] tracking-[0.3em] font-bold group"
        >
          <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:border-red-500/50 transition-colors">
            <LogOut size={14} strokeWidth={1.5} />
          </div>
          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
