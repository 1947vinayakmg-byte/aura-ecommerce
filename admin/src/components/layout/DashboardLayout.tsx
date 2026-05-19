import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'motion/react';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-luxury-bg flex">
      <Sidebar />
      <main className="flex-1 ml-72 relative">
        <Navbar />
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Floating Action Button for Mobile / Quick Actions */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-luxury-gold text-black rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.3)] flex items-center justify-center z-50 lg:hidden"
        >
          <Plus size={24} />
        </motion.button>
      </main>
    </div>
  );
}

// Small helper just for the Outlet motion to work properly
import { Plus } from 'lucide-react';
