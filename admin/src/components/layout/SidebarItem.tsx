import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, isCollapsed, onClick }) => {
  return (
    <NavLink to={to} onClick={onClick}>
      {({ isActive }) => (
        <div className="relative px-4 py-1.5">
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-x-4 inset-y-1.5 bg-luxury-gold/10 border-l-2 border-luxury-gold rounded-r-xl"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <div
            className={cn(
              "relative flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 group",
              isActive 
                ? "text-luxury-gold" 
                : "text-luxury-text-secondary hover:text-white hover:bg-white/5"
            )}
          >
            <Icon size={20} className={cn("shrink-0", isActive && "text-luxury-gold")} />
            {!isCollapsed && (
              <span className="text-sm font-medium tracking-wide">
                {label}
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-luxury-bg border border-luxury-border rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {label}
              </div>
            )}
          </div>
        </div>
      )}
    </NavLink>
  );
};

export default SidebarItem;
