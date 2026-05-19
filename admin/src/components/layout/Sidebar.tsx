import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  PlusCircle,
  ShoppingCart,
  Users,
  Package,
  Layers,
  Ticket,
  Star,
  CreditCard,
  Truck,
  Bell,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  Archive,
  X
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { motion } from 'motion/react';

const menuItems = [
  {
    group: "MAIN", items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/" },
      { name: "AI Insights", icon: Sparkles, path: "/ai-insights" },
      { name: "Analytics", icon: BarChart3, path: "/analytics" },
    ]
  },
  {
    group: "MANAGEMENT", items: [
      { name: "Products", icon: ShoppingBag, path: "/products" },
      { name: "Add Product", icon: PlusCircle, path: "/products/add" },
      { name: "Orders", icon: ShoppingCart, path: "/orders" },
      { name: "Customers", icon: Users, path: "/customers" },
      { name: "Inventory", icon: Package, path: "/inventory" },
      { name: "Categories", icon: Layers, path: "/categories" },
      { name: "Deleted Products", icon: Archive, path: "/deleted-products" },
    ]
  },
  {
    group: "MARKETING", items: [
      { name: "Coupons", icon: Ticket, path: "/coupons" },
      { name: "Reviews", icon: Star, path: "/reviews" },
    ]
  },
  {
    group: "OPERATIONS", items: [
      { name: "Payments", icon: CreditCard, path: "/payments" },
      { name: "Shipping", icon: Truck, path: "/shipping" },
      { name: "Reports", icon: FileText, path: "/reports" },
    ]
  },
  {
    group: "SYSTEM", items: [
      { name: "Settings", icon: Settings, path: "/settings" },
      { name: "Logout", icon: LogOut, path: "/logout" },
    ]
  }
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  return (
    <aside className={`w-72 h-screen fixed left-0 top-0 bg-luxury-sidebar border-r border-luxury-border flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-6 right-6 p-2 text-luxury-text-secondary hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      <div className="p-8 flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="w-10 h-10 bg-luxury-gold flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          <span className="text-black font-display font-bold text-xl">A</span>
        </motion.div>
        <div>
          <h1 className="font-display font-bold text-xl tracking-tight text-white">AURA</h1>
          <p className="text-[10px] text-luxury-gold tracking-[0.2em] font-medium leading-none uppercase">Maison de Luxe</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 scrollbar-hide">
        {menuItems.map((group) => (
          <div key={group.group} className="space-y-1">
            <h3 className="px-6 text-[10px] font-bold text-luxury-text-secondary tracking-[0.2em] uppercase mb-4 opacity-50">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.name}
                  to={item.path}
                  icon={item.icon}
                  label={item.name}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-luxury-border">
        <div className="flex items-center gap-4 px-2 py-3 glass-card bg-white/[0.02] border-none rounded-2xl">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover border border-luxury-gold/30"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-luxury-sidebar" />
          </div>
          <div className="min-w-0">
            <p className="font-luxury font-semibold text-sm text-white truncate">Alexander Vane</p>
            <p className="text-[10px] text-luxury-gold font-medium uppercase tracking-wider">Store Director</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

