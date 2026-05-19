import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-bg flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md glass-card p-10 space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="w-16 h-16 bg-luxury-gold mx-auto flex items-center justify-center rounded-2xl shadow-gold mb-6"
          >
            <Sparkles className="text-black" size={32} />
          </motion.div>
          <h1 className="text-4xl font-display font-bold luxury-gradient-text tracking-tight">AURA</h1>
          <p className="text-luxury-gold text-xs tracking-[0.3em] font-medium uppercase">Maison de Luxe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary group-focus-within:text-luxury-gold transition-colors" size={18} />
              <input
                type="email"
                required
                className="w-full luxury-input pl-12"
                placeholder="director@aura.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary group-focus-within:text-luxury-gold transition-colors" size={18} />
              <input
                type="password"
                required
                className="w-full luxury-input pl-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center font-medium"
            >
              {error}
            </motion.p>
          )}

          <button type="submit" className="w-full luxury-button-primary flex items-center justify-center gap-2 mt-4 group">
            <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
            ENTER THE MAISON
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-xs text-luxury-text-secondary hover:text-luxury-gold transition-colors tracking-widest uppercase"
          >
            Forgot Credentials?
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
