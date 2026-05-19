import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, Sparkles, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
    : 3;

  const strengthLabels = ['', 'Too Short', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing reset token.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const res = await authService.resetPassword(token, password);
      setMessage(res.message || 'Password updated successfully.');
      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || 'Reset failed. The link may have expired.'
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
            Set New Password
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
                <p className="text-white font-semibold text-sm">Password Updated!</p>
                <p className="text-luxury-text-secondary text-xs leading-relaxed">{message}</p>
                <p className="text-luxury-text-secondary text-xs">
                  Redirecting to login in <span className="text-luxury-gold font-medium">3 seconds</span>…
                </p>
              </div>
              <Link to="/login" className="inline-flex items-center gap-2 text-xs text-luxury-gold hover:text-white transition-colors tracking-widest uppercase">
                Go to Login Now
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
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-luxury-gold/5 border border-luxury-gold/20">
                <ShieldCheck className="text-luxury-gold shrink-0" size={15} />
                <p className="text-luxury-text-secondary text-xs leading-relaxed">
                  Choose a strong password with at least 6 characters.
                </p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">
                  New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary group-focus-within:text-luxury-gold transition-colors" size={18} />
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full luxury-input pl-12 pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={status === 'loading'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary hover:text-luxury-gold transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : 'bg-white/10'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs pl-1 ${strengthColors[strength].replace('bg-', 'text-')}`}>
                      {strengthLabels[strength]}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary group-focus-within:text-luxury-gold transition-colors" size={18} />
                  <input
                    id="reset-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    className={`w-full luxury-input pl-12 pr-12 transition-all ${
                      confirm && password !== confirm ? 'border-red-500/50' : confirm && password === confirm ? 'border-green-500/40' : ''
                    }`}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={status === 'loading'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary hover:text-luxury-gold transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirm && password !== confirm && (
                  <p className="text-red-400 text-xs pl-1">Passwords don't match</p>
                )}
              </div>

              {status === 'error' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs text-center">
                  {message}
                </motion.p>
              )}

              <button
                id="reset-submit"
                type="submit"
                disabled={status === 'loading'}
                className="w-full luxury-button-primary flex items-center justify-center gap-2 mt-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating Password…
                  </>
                ) : (
                  'Update Password'
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-xs text-luxury-text-secondary hover:text-luxury-gold transition-colors tracking-widest uppercase">
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

export default ResetPassword;
