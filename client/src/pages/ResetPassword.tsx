import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import API from '../services/api';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.put(`/users/reset-password/${token}`, { password });
      setMessage({ type: 'success', text: data.message || 'Password reset successfully.' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to reset password. The token may be invalid or expired.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden bg-luxury-bg">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass p-10 md:p-14 rounded-sm border border-luxury-gold/20 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-6 text-luxury-gold shadow-gold">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-display tracking-widest text-white mb-2 uppercase">Reset Password</h1>
          <p className="text-xs text-secondary tracking-widest uppercase">Enter your new credentials below</p>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-sm mb-8 text-xs tracking-wider uppercase border font-medium text-center ${
              message.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
            {message.type === 'success' && <p className="mt-2 text-[10px] text-white">Redirecting to login...</p>}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1 block">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={16} />
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full luxury-input pl-10 pr-12 py-4 bg-black/40 border border-white/10 rounded-sm text-xs tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/20"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={16} />
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full luxury-input pl-10 pr-12 py-4 bg-black/40 border border-white/10 rounded-sm text-xs tracking-widest text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/20"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || message?.type === 'success'}
            className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-black font-bold py-4 rounded-sm tracking-[0.3em] uppercase text-xs transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:pointer-events-none mt-8 shadow-gold"
          >
            <span>{loading ? 'Authorizing...' : 'Update Password'}</span>
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-white/10 pt-6">
          <Link to="/login" className="text-[10px] text-secondary tracking-[0.3em] uppercase hover:text-luxury-gold transition-colors inline-flex items-center gap-2 font-bold">
            Return to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
