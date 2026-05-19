import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, TrendingUp, Target, Zap, Loader2, BrainCircuit,
  RefreshCw, Package, Users, DollarSign, ListChecks, ChevronDown, ChevronUp
} from 'lucide-react';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface InsightSection {
  title: string;
  content: string;
  icon: React.ComponentType<any>;
  color: string;
}

// Parse the Gemini response sections from markdown headers
function parseInsightSections(raw: string): InsightSection[] {
  const sectionDefs = [
    { key: 'MARKET TRENDS',         icon: TrendingUp,  color: 'text-blue-400'   },
    { key: 'INVENTORY INTELLIGENCE', icon: Package,     color: 'text-amber-400'  },
    { key: 'CUSTOMER INTELLIGENCE',  icon: Users,       color: 'text-purple-400' },
    { key: 'REVENUE OPTIMIZATION',   icon: DollarSign,  color: 'text-luxury-gold'},
    { key: 'EXECUTIVE ACTION PLAN',  icon: ListChecks,  color: 'text-green-400'  },
  ];

  const sections: InsightSection[] = [];

  sectionDefs.forEach((def, idx) => {
    const startPattern = new RegExp(`##\\s*${def.key}`, 'i');
    const nextPattern = idx < sectionDefs.length - 1
      ? new RegExp(`##\\s*${sectionDefs[idx + 1].key}`, 'i')
      : null;

    const startMatch = raw.search(startPattern);
    if (startMatch === -1) return;

    const contentStart = raw.indexOf('\n', startMatch) + 1;
    const contentEnd = nextPattern ? raw.search(nextPattern) : raw.length;

    const content = raw.slice(contentStart, contentEnd !== -1 ? contentEnd : raw.length).trim();
    sections.push({
      title: def.key.replace(/_/g, ' '),
      content,
      icon: def.icon,
      color: def.color,
    });
  });

  // Fallback: if parsing failed just dump the raw text as one section
  if (sections.length === 0) {
    sections.push({
      title: 'EXECUTIVE BRIEFING',
      content: raw,
      icon: BrainCircuit,
      color: 'text-luxury-gold',
    });
  }

  return sections;
}

export default function AIInsights() {
  const [loading, setLoading] = useState(false);
  const [rawInsights, setRawInsights] = useState<string | null>(null);
  const [sections, setSections] = useState<InsightSection[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    const toastId = toast.loading('Consulting the elite intelligence network...');
    try {
      // Sends real data fetch request — backend pulls live DB stats + calls Gemini
      const response = await aiService.getInsights({});
      const raw = response.insights;
      setRawInsights(raw);
      setSections(parseInsightSections(raw));
      setGeneratedAt(response.generatedAt || new Date().toISOString());
      setExpandedIdx(0); // auto-expand first section
      toast.success('Executive briefing ready', { id: toastId });
    } catch (error: any) {
      console.error('Insight generation failed', error);
      toast.error(error?.response?.data?.message || 'AI network unavailable', { id: toastId });
      setSections([{
        title: 'CONNECTION ERROR',
        content: 'Unable to connect to the intelligence network. Ensure your GEMINI_API_KEY is set in the server .env file and the backend is running.',
        icon: BrainCircuit,
        color: 'text-red-400',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRawInsights(null);
    setSections([]);
    setGeneratedAt(null);
    setExpandedIdx(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full">
          <BrainCircuit className="text-luxury-gold" size={16} />
          <span className="text-xs font-bold text-luxury-gold tracking-widest uppercase">Aura Intelligence Pulse</span>
        </div>
        <h1 className="text-5xl font-display font-bold tracking-tight">
          AI Strategy & <span className="gold-gradient-text">Executive Insights</span>
        </h1>
        <p className="text-luxury-text-secondary max-w-2xl mx-auto font-luxury text-lg">
          Harness live Gemini AI to analyze your real store performance — revenue, inventory, customer trends — and generate bespoke strategic recommendations.
        </p>
      </div>

      {/* Category Icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: TrendingUp, label: 'MARKET TRENDS' },
          { icon: Target,     label: 'INVENTORY PREDICTION' },
          { icon: Zap,        label: 'CUSTOMER SENTIMENT' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="glass-card p-6 flex flex-col items-center gap-4 text-center group hover:bg-luxury-gold/5 transition-all cursor-default">
            <div className="p-3 bg-white/[0.03] rounded-2xl border border-luxury-border group-hover:border-luxury-gold/30 transition-all">
              <Icon className="text-luxury-text-secondary group-hover:text-luxury-gold transition-all" size={24} />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-luxury-text-secondary group-hover:text-luxury-text-primary uppercase transition-all">{label}</span>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="glass-card p-1 pb-1 overflow-hidden">
        <div className="bg-luxury-sidebar/40 p-10 rounded-[15px] border border-luxury-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-luxury-gold/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <AnimatePresence mode="wait">
              {/* ── IDLE STATE ── */}
              {sections.length === 0 && !loading && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6 py-4"
                >
                  <div className="w-24 h-24 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(212,175,55,0.15)] outline outline-1 outline-luxury-gold/30">
                    <Sparkles className="text-luxury-gold" size={40} />
                  </div>
                  <h3 className="text-2xl font-display font-bold">Ready for Analysis</h3>
                  <p className="text-luxury-text-secondary font-luxury max-w-md mx-auto">
                    Click below to generate a <strong className="text-white">live AI executive briefing</strong> powered by your real store data — orders, revenue, inventory, and customer behavior.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateInsights}
                    disabled={loading}
                    className="bg-luxury-gold hover:bg-luxury-gold-hover text-black px-10 py-4 rounded-2xl font-luxury font-bold transition-all shadow-[0_4px_20px_rgba(212,175,55,0.25)] flex items-center gap-3 disabled:opacity-50 mx-auto"
                  >
                    <BrainCircuit size={20} />
                    GENERATE LIVE EXECUTIVE INSIGHTS
                  </motion.button>
                </motion.div>
              )}

              {/* ── LOADING STATE ── */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6 py-12"
                >
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full border-2 border-luxury-gold/20 animate-ping" />
                    <div className="w-24 h-24 bg-luxury-gold/10 rounded-full flex items-center justify-center border border-luxury-gold/30">
                      <Loader2 className="text-luxury-gold animate-spin" size={36} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold">Analyzing Your Empire...</h3>
                    <p className="text-luxury-text-secondary text-sm mt-2 font-luxury animate-pulse">
                      Fetching live data · Consulting Gemini AI · Crafting executive briefing
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── RESULTS STATE ── */}
              {sections.length > 0 && !loading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-6"
                >
                  {/* Results Header */}
                  <div className="flex items-center justify-between border-b border-luxury-border pb-6">
                    <div className="flex items-center gap-3">
                      <Sparkles className="text-luxury-gold" size={24} />
                      <div>
                        <h3 className="text-xl font-display font-bold">Strategic Executive Briefing</h3>
                        {generatedAt && (
                          <p className="text-[10px] text-luxury-text-secondary font-mono mt-0.5">
                            Generated · {format(new Date(generatedAt), 'MMM dd, yyyy HH:mm')} · Powered by Google Gemini AI
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={generateInsights}
                        disabled={loading}
                        className="flex items-center gap-2 bg-white/[0.03] border border-luxury-border px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/[0.05] transition-all text-luxury-text-secondary hover:text-white"
                      >
                        <RefreshCw size={13} /> REGENERATE
                      </button>
                      <button
                        onClick={handleReset}
                        className="text-xs font-bold text-luxury-text-secondary hover:text-luxury-gold transition-colors"
                      >
                        RESET ENGINE
                      </button>
                    </div>
                  </div>

                  {/* Accordion Sections */}
                  <div className="space-y-3">
                    {sections.map((section, idx) => {
                      const Icon = section.icon;
                      const isOpen = expandedIdx === idx;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? 'border-luxury-gold/30 bg-luxury-gold/[0.02]' : 'border-luxury-border bg-white/[0.01] hover:bg-white/[0.02]'}`}
                        >
                          {/* Accordion Header */}
                          <button
                            onClick={() => setExpandedIdx(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-5 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 ${section.color}`}>
                                <Icon size={16} />
                              </div>
                              <span className="text-sm font-bold uppercase tracking-widest text-white">{section.title}</span>
                            </div>
                            {isOpen
                              ? <ChevronUp size={16} className="text-luxury-gold shrink-0" />
                              : <ChevronDown size={16} className="text-luxury-text-secondary shrink-0" />
                            }
                          </button>

                          {/* Accordion Content */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 pt-1 border-t border-luxury-border/30">
                                  <div className="text-sm font-luxury text-luxury-text-primary leading-relaxed whitespace-pre-wrap">
                                    {section.content}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Footer Quote */}
                  <div className="mt-4 p-6 bg-luxury-gold/5 border border-luxury-gold/20 rounded-2xl">
                    <p className="text-xs font-bold text-luxury-gold tracking-widest uppercase mb-1">AI INTELLIGENCE DISCLAIMER</p>
                    <p className="text-sm font-luxury italic text-luxury-text-secondary">
                      "These insights are generated by Google Gemini AI using your live store data. Use them as strategic guidance — always combine with human expertise and market judgment."
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
