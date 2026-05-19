import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="pt-12 pb-20 px-6 md:px-12 bg-luxury-black min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-luxury-card p-10 md:p-14 glass rounded-sm z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-display tracking-[0.3em] mb-4 uppercase">
            {isLogin ? "Welcome Back" : "AURA L'ÉLITE"}
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-secondary">
            {isLogin ? "Enter the realm of exclusivity" : "Begin your journey into luxury"}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-0 bottom-4 text-primary/30" strokeWidth={1.5} />
                <input 
                  type="text" 
                  placeholder="Alexander McQueen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-primary/10 pb-4 pl-8 text-xs tracking-widest focus:outline-none focus:border-luxury-gold transition-colors uppercase"
                />

              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-0 bottom-4 text-primary/30" strokeWidth={1.5} />
              <input 
                type="email" 
                placeholder="vip@aura-elite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-primary/10 pb-4 pl-8 text-xs tracking-widest focus:outline-none focus:border-luxury-gold transition-colors uppercase"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Password</label>
              {isLogin && <button type="button" className="text-[9px] uppercase tracking-widest hover:text-luxury-gold transition-colors">Forgot?</button>}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-0 bottom-4 text-primary/30" strokeWidth={1.5} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-primary/10 pb-4 pl-8 text-xs tracking-widest focus:outline-none focus:border-luxury-gold transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-luxury-black py-6 rounded-sm text-[10px] uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3 hover:bg-luxury-gold transition-all gold-glow group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "PROCESSING..." : (isLogin ? "AUTHORIZE" : "CREATE ACCOUNT")} 
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />}
          </button>

        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/10"></div>
          </div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em]">
            <span className="bg-luxury-card px-4 text-secondary">Or</span>
          </div>
        </div>

        <div className="flex justify-center w-full mb-8">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                setLoading(true);
                setError('');
                try {
                  await googleLogin({ credential: credentialResponse.credential });
                  navigate('/dashboard');
                } catch (err: any) {
                  setError(err.message || 'Google Login failed');
                } finally {
                  setLoading(false);
                }
              }
            }}
            onError={() => {
              setError('Google Login Failed');
            }}
            theme="filled_black"
            shape="rectangular"
            text={isLogin ? "signin_with" : "signup_with"}
            width="320"
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-secondary uppercase tracking-widest mb-4">
            {isLogin ? "Dont have an account?" : "Already a member?"}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary text-[10px] tracking-[0.3em] font-black border-b border-luxury-gold pb-1 uppercase hover:text-luxury-gold transition-colors"
          >
            {isLogin ? "Join the Movement" : "Access Your Sanctuary"}
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/5 flex items-center justify-center gap-2 opacity-30">
          <ShieldCheck size={14} />
          <span className="text-[8px] uppercase tracking-[0.4em]">Secure Cryptographic Entry</span>
        </div>
      </motion.div>
    </main>
  );
};

export default Login;
