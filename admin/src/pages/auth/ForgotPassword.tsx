import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message || 'Reset link sent. Please check your inbox.');
      setStatus('success');
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || 'Something went wrong. Please try again.'
      );
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-bg flex items-center justify-center p-4">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md glass-card p-10 space-y-8 relative z-10"
      >
        {/* Header */}
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
          <p className="text-luxury-gold text-xs tracking-[0.3em] font-medium uppercase">
            Password Recovery
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            /* ─── Success State ─── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={32} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-white font-semibold text-sm">Check your inbox</p>
                <p className="text-luxury-text-secondary text-xs leading-relaxed">
                  {message}
                </p>
                <p className="text-luxury-text-secondary text-xs">
                  The link expires in <span className="text-luxury-gold font-medium">30 minutes</span>.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs text-luxury-gold hover:text-white transition-colors tracking-widest uppercase"
              >
                <ArrowLeft size={14} />
                Back to Login
              </Link>
            </motion.div>
          ) : (
            /* ─── Form State ─── */
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <p className="text-luxury-text-secondary text-sm text-center leading-relaxed">
                Enter your admin email address and we'll send you a secure link to reset your password.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary group-focus-within:text-luxury-gold transition-colors"
                    size={18}
                  />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    className="w-full luxury-input pl-12"
                    placeholder="director@aura.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs text-center"
                >
                  {message}
                </motion.p>
              )}

              <button
                id="forgot-submit"
                type="submit"
                disabled={status === 'loading'}
                className="w-full luxury-button-primary flex items-center justify-center gap-2 mt-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending Link…
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs text-luxury-text-secondary hover:text-luxury-gold transition-colors tracking-widest uppercase"
                >
                  <ArrowLeft size={13} />
                  Back to Login
                </Link>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
