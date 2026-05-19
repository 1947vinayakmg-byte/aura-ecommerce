import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, ShieldCheck, Award, Loader2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  role?: string;
  createdAt?: string;
}

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/users/profile');
        setProfile(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-bg pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
          <p className="text-xs uppercase tracking-widest text-secondary font-bold">Retrieving Dossier...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-bg pt-20 px-4">
        <div className="max-w-md w-full glass p-10 text-center rounded-sm border border-red-500/20">
          <p className="text-xs uppercase tracking-widest text-red-400 mb-4">{error || 'Profile unavailable'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest rounded-sm"
          >
            Retry Verification
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = profile.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Privileged Member';

  return (
    <div className="min-h-screen bg-luxury-bg pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-display tracking-widest text-primary uppercase">Client Dossier</h1>
          <div className="w-20 h-[1px] bg-luxury-gold mx-auto" />
          <p className="text-xs text-secondary tracking-[0.3em] uppercase">AURA L'ÉLITE Privileged Identification</p>
        </div>

        {/* Main Dossier Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-10 md:p-14 rounded-sm border border-luxury-gold/20 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-10 items-center"
        >
          {/* Avatar / Membership Tier */}
          <div className="flex flex-col items-center text-center space-y-6 md:border-r border-primary/10 md:pr-10">
            <div className="w-32 h-32 rounded-full bg-gradient-to-b from-luxury-gold/20 to-black/60 border border-luxury-gold/40 flex items-center justify-center text-luxury-gold shadow-gold relative group">
              <User size={56} strokeWidth={1} />
              <div className="absolute -bottom-2 bg-luxury-gold text-black text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                {profile.isAdmin ? 'Elite Curator' : 'VIP Patron'}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-display tracking-wider text-primary uppercase">{profile.name}</h2>
              <p className="text-[10px] text-luxury-gold tracking-[0.2em] uppercase flex items-center justify-center gap-1">
                <Award size={12} /> Tier 1 Privileged
              </p>
            </div>
          </div>

          {/* Credentials Dossier */}
          <div className="md:col-span-2 space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-secondary border-b border-primary/10 pb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-luxury-gold" /> Identity Verification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 p-6 bg-primary/5 border border-primary/5 rounded-sm">
                <div className="flex items-center gap-3 text-luxury-text-secondary text-[10px] uppercase tracking-widest font-bold">
                  <User size={14} className="text-luxury-gold" /> Full Name
                </div>
                <p className="text-sm font-medium tracking-wider text-primary">{profile.name}</p>
              </div>

              <div className="space-y-2 p-6 bg-primary/5 border border-primary/5 rounded-sm">
                <div className="flex items-center gap-3 text-luxury-text-secondary text-[10px] uppercase tracking-widest font-bold">
                  <Mail size={14} className="text-luxury-gold" /> Electronic Mail
                </div>
                <p className="text-sm font-medium tracking-wider text-primary">{profile.email}</p>
              </div>

              <div className="space-y-2 p-6 bg-primary/5 border border-primary/5 rounded-sm">
                <div className="flex items-center gap-3 text-luxury-text-secondary text-[10px] uppercase tracking-widest font-bold">
                  <Calendar size={14} className="text-luxury-gold" /> Patron Since
                </div>
                <p className="text-sm font-medium tracking-wider text-primary">{formattedDate}</p>
              </div>

              <div className="space-y-2 p-6 bg-primary/5 border border-primary/5 rounded-sm">
                <div className="flex items-center gap-3 text-luxury-text-secondary text-[10px] uppercase tracking-widest font-bold">
                  <Award size={14} className="text-luxury-gold" /> Security Clearance
                </div>
                <p className="text-sm font-medium tracking-wider text-luxury-gold">
                  {profile.isAdmin ? 'Level 5 (Administrative)' : 'Level 1 (Client)'}
                </p>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => window.location.href = '/my-orders'}
                className="flex-1 bg-luxury-gold hover:bg-luxury-gold/90 text-black font-bold py-4 rounded-sm tracking-[0.2em] uppercase text-xs transition-all text-center shadow-gold"
              >
                View Acquisitions
              </button>
              <button 
                onClick={() => window.location.href = '/wishlist'}
                className="flex-1 bg-transparent hover:bg-primary/5 text-primary border border-primary/20 font-bold py-4 rounded-sm tracking-[0.2em] uppercase text-xs transition-all text-center"
              >
                The Vault
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
