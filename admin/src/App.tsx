import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import AppRoutes from './routes/AppRoutes';
import { motion } from 'motion/react';
import './styles/globals.css';

function GlobalLoader() {
  return (
    <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full"
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <Router>
            <Suspense fallback={<GlobalLoader />}>
              <AppRoutes />
            </Suspense>
          </Router>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
