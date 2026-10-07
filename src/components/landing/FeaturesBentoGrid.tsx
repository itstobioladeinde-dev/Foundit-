import React from 'react';
import { Layers, ShieldCheck, DollarSign, ExternalLink, Filter, TrendingDown, Sparkles } from 'lucide-react';

export const FeaturesBentoGrid: React.FC = () => {
  return (
    <section id="features" className="py-20 max-w-6xl mx-auto px-4 text-left">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-emerald-950/80 text-[#ccff00] border border-[#ccff00]/30 mb-4 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
          <span>ENTERPRISE PROCUREMENT ADVANTAGE</span>
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
          Engineered to Stop Overpaying for Physical Goods
        </h2>
        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
          Designed specifically for estimators, supply chain analysts, and commercial buyers who require verifiable proof before cutting a purchase order.
        </p>
      </div>

      {/* Asymmetric Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bento 1: Wide Card (Span 2 cols) */}
        <div className="md:col-span-2 p-8 rounded-[24px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 hover:border-[#ccff00]/60 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(204,255,0,0.1)_0%,transparent_70%)] pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ccff00] font-mono">
                Packaging & Variant Intelligence
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-950 text-[#ccff00] flex items-center justify-center border border-[#ccff00]/30">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Bulk Packaging & Accessory Segregation
            </h3>
            <p className="mt-2.5 text-sm text-slate-300 max-w-xl leading-relaxed">
              Standard web search tools mix up a single $35 plywood sheet with a $750 bundle of 25 sheets, or a $1,200 compressor with a $15 replacement air filter. MarketProbe’s semantic classifier isolates packaging units, preventing skewed averages.
            </p>
          </div>

          {/* Interactive visual preview */}
          <div className="mt-8 p-4 bg-black/40 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-[#0e2c1c] rounded-xl border border-[#ccff00]/40 shadow-inner">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">Single Unit (CDX Sheet)</span>
                <span className="text-[10px] font-bold text-[#06130c] bg-[#ccff00] px-1.5 py-0.5 rounded font-mono">
                  Exact Match
                </span>
              </div>
              <div className="font-mono text-white font-bold text-base">$34.50 / sheet</div>
              <p className="text-[11px] text-emerald-300 mt-0.5">Anchors the representative baseline.</p>
            </div>

            <div className="p-3.5 bg-white/[0.04] rounded-xl border border-white/5 opacity-80">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-300">Contractor Pallet (50 Sheets)</span>
                <span className="text-[10px] font-medium text-slate-400 bg-white/10 px-1.5 py-0.5 rounded font-mono">
                  Bulk Divergence
                </span>
              </div>
              <div className="font-mono text-slate-400 font-bold text-base">$1,520 / pallet</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Segregated from single-unit baseline.</p>
            </div>
          </div>
        </div>

        {/* Bento 2: Tall Card (Span 1 col) */}
        <div className="p-8 rounded-[24px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 hover:border-[#ccff00]/60 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ccff00] font-mono">
                Anomaly Filtration
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-950 text-[#ccff00] flex items-center justify-center border border-[#ccff00]/30">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white">
              IQR Outlier Elimination
            </h3>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Price-gouging resellers and placeholder catalog pricing ($0.01 or $99,999) are algorithmically tagged and removed from benchmark calculations.
            </p>
          </div>

          <div className="mt-6 p-4 bg-emerald-950/70 rounded-xl border border-emerald-500/30 text-xs text-slate-200">
            <span className="font-semibold text-[#ccff00] block mb-0.5">Transparent Isolation:</span>
            Outliers remain documented in the audit log, but never distort your floor or ceiling spread.
          </div>
        </div>

        {/* Bento 3: Card (Span 1 col) */}
        <div className="p-8 rounded-[24px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 hover:border-[#ccff00]/60 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ccff00] font-mono">
                Domestic & Global
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-950 text-[#ccff00] flex items-center justify-center border border-[#ccff00]/30">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white">
              Multi-Currency & Nigeria Support
            </h3>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Prioritizes Nigerian merchant listings in NGN when querying Nigerian markets, while seamlessly converting international cross-border supplier quotes.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono font-semibold">
            <span className="px-2.5 py-1 bg-white/10 text-[#ccff00] rounded-lg border border-white/5">NGN (₦)</span>
            <span className="px-2.5 py-1 bg-white/10 text-white rounded-lg border border-white/5">USD ($)</span>
            <span className="px-2.5 py-1 bg-white/10 text-white rounded-lg border border-white/5">EUR (€)</span>
            <span className="px-2.5 py-1 bg-white/10 text-white rounded-lg border border-white/5">GBP (£)</span>
          </div>
        </div>

        {/* Bento 4: Wide Card (Span 2 cols) */}
        <div className="md:col-span-2 p-8 rounded-[24px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 hover:border-[#ccff00]/60 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ccff00] font-mono">
                Evidence Integrity
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-950 text-[#ccff00] flex items-center justify-center border border-[#ccff00]/30">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">
              100% Attributed Source Audit Trail
            </h3>
            <p className="mt-2.5 text-sm text-slate-300 max-w-xl leading-relaxed">
              Every data point in MarketProbe traces back to a live, verifiable merchant or distributor URL. No black-box guesses. You can click directly into vendor spec sheets and order pages to verify availability in real-time.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-slate-300 border-t border-white/10 pt-4">
            <ShieldCheck className="w-4 h-4 text-[#ccff00] shrink-0" />
            <span>Zero hallucinated prices · Direct vendor catalog URLs · Preserved original currencies</span>
          </div>
        </div>

      </div>
    </section>
  );
};
