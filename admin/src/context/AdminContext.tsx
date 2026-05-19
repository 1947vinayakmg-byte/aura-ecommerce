import React, { createContext, useContext, useState } from 'react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  activeProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
}

interface AdminContextType {
  stats: DashboardStats | null;
  setStats: (stats: DashboardStats) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <AdminContext.Provider value={{ stats, setStats, isSidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
