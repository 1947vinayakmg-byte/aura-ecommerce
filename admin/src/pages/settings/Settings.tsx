import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard, 
  LogOut,
  Camera,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '../../utils/utils';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>('profile');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-display font-bold">Maison Configuration</h1>
        <p className="text-luxury-text-secondary text-sm">Manage your professional profile and global administrative preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass-card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-luxury-gold text-black shadow-gold" 
                    : "text-luxury-text-secondary hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-luxury-border">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all">
                <LogOut size={18} />
                Logout Session
              </button>
            </div>
          </div>
        </div>

        {/* Main Settings Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-8"
            >
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-luxury-border pb-6">
                    <h3 className="text-xl font-display font-bold">Public Identity</h3>
                    <button className="luxury-button-primary text-xs py-2 px-6">SAVE CHANGES</button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Avatar Portrait</p>
                      <div className="relative group w-32 h-32">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
                          alt="Avatar" 
                          className="w-full h-full rounded-2xl object-cover border-2 border-luxury-border group-hover:border-luxury-gold transition-colors"
                        />
                        <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-2xl transition-opacity">
                          <Camera size={24} className="text-luxury-gold mb-1" />
                          <span className="text-[8px] font-bold text-white uppercase tracking-widest">Change</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">First Name</label>
                        <input type="text" defaultValue="Alexander" className="w-full luxury-input" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Last Name</label>
                        <input type="text" defaultValue="Vane" className="w-full luxury-input" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Email Address</label>
                        <input type="email" defaultValue="vane@aura.com" className="w-full luxury-input" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Professional Biography</label>
                        <textarea rows={4} className="w-full luxury-input resize-none" defaultValue="Executive Director at Aura L'Élite. Curating luxury experiences since 2012." />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-luxury-border pb-6">
                    <h3 className="text-xl font-display font-bold">Security & Access</h3>
                    <button className="luxury-button-primary text-xs py-2 px-6">UPDATE SECURITY</button>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <p className="text-[10px] font-bold text-luxury-gold tracking-widest uppercase">Change Password</p>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Current Password</label>
                            <input type="password" placeholder="••••••••" className="w-full luxury-input" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">New Password</label>
                            <div className="relative">
                              <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="w-full luxury-input" 
                              />
                              <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary hover:text-luxury-gold transition-colors"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <p className="text-[10px] font-bold text-luxury-gold tracking-widest uppercase">Two-Factor Authentication</p>
                        <div className="p-6 bg-white/[0.02] border border-luxury-border rounded-2xl space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
                              <Shield size={24} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">Secure Access Enabled</p>
                              <p className="text-xs text-luxury-text-secondary">2FA is currently active via Authenticator app.</p>
                            </div>
                          </div>
                          <button className="w-full py-2 border border-luxury-border rounded-xl text-xs font-bold text-luxury-text-secondary hover:text-white hover:bg-white/5 transition-all">
                            MANAGE 2FA METHODS
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-luxury-border space-y-4">
                      <h4 className="font-display font-bold flex items-center gap-2">
                        <Globe size={18} className="text-luxury-gold" /> ACTIVE SESSIONS
                      </h4>
                      <div className="space-y-3">
                        {[
                          { device: 'MacBook Pro 16"', location: 'Paris, France', status: 'Current Session', ip: '192.168.1.1' },
                          { device: 'iPhone 15 Pro', location: 'London, UK', status: 'Last seen 2h ago', ip: '192.168.1.42' },
                        ].map((session, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.01] border border-luxury-border rounded-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-luxury-gold">
                                <Lock size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{session.device}</p>
                                <p className="text-xs text-luxury-text-secondary">{session.location} • {session.ip}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-luxury-gold tracking-widest uppercase">{session.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-luxury-border pb-6">
                    <h3 className="text-xl font-display font-bold">Alert Preferences</h3>
                    <button className="luxury-button-primary text-xs py-2 px-6">SAVE PREFERENCES</button>
                  </div>

                  <div className="space-y-6">
                    {[
                      { title: 'Executive Reports', desc: 'Monthly summary of sales, revenue, and client growth.', default: true },
                      { title: 'Security Alerts', desc: 'Get notified of new login attempts and security changes.', default: true },
                      { title: 'Order Intelligence', desc: 'Real-time updates on high-value luxury orders.', default: true },
                      { title: 'Concierge Messages', desc: 'Direct alerts from clients and staff members.', default: false },
                    ].map((pref, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-2xl transition-all">
                        <div className="space-y-1">
                          <p className="font-bold text-white">{pref.title}</p>
                          <p className="text-xs text-luxury-text-secondary max-w-sm">{pref.desc}</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={pref.default} className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold">
                    <CreditCard size={40} />
                  </div>
                  <h3 className="text-2xl font-display font-bold">Enterprise Billing</h3>
                  <p className="text-luxury-text-secondary max-w-xs">Financial records and subscription management for the Aura L'Élite Enterprise plan.</p>
                  <button className="luxury-button-primary mt-4">VIEW INVOICES</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
