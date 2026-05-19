import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/users/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-12 pb-20 px-6 md:px-12 bg-luxury-black min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-luxury-card p-10 md:p-14 glass rounded-sm z-10"
      >
        <Link to="/login" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-secondary hover:text-luxury-gold transition-colors mb-10">
          <ArrowLeft size={14} />
          Back to Login
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-display tracking-[0.2em] mb-4 uppercase">
            Reset Password
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-secondary">
            Enter your email to receive a password reset link
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
              <ShieldCheck size={28} className="text-green-500" />
            </div>
            <p className="text-sm text-secondary tracking-widest uppercase">
              A password reset link has been sent to your email address. Please check your inbox.
            </p>
            <Link
              to="/login"
              className="inline-block text-[10px] uppercase tracking-[0.3em] text-luxury-gold border-b border-luxury-gold pb-1 hover:text-primary transition-colors"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-0 bottom-4 text-primary/30" strokeWidth={1.5} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-primary/10 pb-4 pl-8 text-xs tracking-widest focus:outline-none focus:border-luxury-gold transition-colors uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-luxury-black py-5 rounded-sm text-[10px] uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3 hover:bg-luxury-gold transition-all gold-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-12 pt-8 border-t border-primary/5 flex items-center justify-center gap-2 opacity-30">
          <ShieldCheck size={14} />
          <span className="text-[8px] uppercase tracking-[0.4em]">Secure Identity Verification</span>
        </div>
      </motion.div>
    </main>
  );
};

export default ForgotPassword;
