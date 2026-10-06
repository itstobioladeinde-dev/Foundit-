import React from 'react';
import { Layers, ShieldCheck, DollarSign, ExternalLink, Filter, TrendingDown, Sparkles } from 'lucide-react';

export const FeaturesBentoGrid: React.FC = () => {
  return (
    <section id="features" className="py-20 max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/70 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>ENTERPRISE PROCUREMENT ADVANTAGE</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight leading-tight">
          Engineered to Stop Overpaying for Physical Goods & Materials
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Designed specifically for estimators, supply chain analysts, and commercial buyers who require verifiable proof before cutting a purchase order.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bento 1: Wide Card (Span 2 cols) */}
        <div className="md:col-span-2 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Packaging & Variant Intelligence
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Bulk Packaging & Accessory Segregation
            </h3>
            <p className="mt-2.5 text-sm text-slate-600 max-w-xl leading-relaxed">
              Standard web search tools mix up a single $35 plywood sheet with a $750 bundle of 25 sheets, or a $1,200 compressor with a $15 replacement air filter. MarketProbe’s semantic classifier isolates packaging units, preventing skewed averages.
            </p>
          </div>

          {/* Interactive visual preview */}
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-emerald-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-emerald-800">Single Unit (CDX Sheet)</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Exact Match</span>
              </div>
              <div className="font-mono text-slate-900 font-bold text-base">$34.50 / sheet</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Anchors the representative baseline.</p>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-slate-200 shadow-2xs opacity-80">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Contractor Pallet (50 Sheets)</span>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Bulk Divergence</span>
              </div>
              <div className="font-mono text-slate-500 font-bold text-base">$1,520 / pallet</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Segregated from single-unit baseline.</p>
            </div>
          </div>
        </div>

        {/* Bento 2: Tall Card (Span 1 col) */}
        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Anomaly Filtration
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-100">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              IQR Outlier Elimination
            </h3>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Price-gouging resellers and placeholder catalog pricing ($0.01 or $99,999) are algorithmically tagged and removed from benchmark calculations.
            </p>
          </div>

          <div className="mt-6 p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-900">
            <span className="font-semibold block mb-0.5">Transparent Isolation:</span>
            Outliers remain documented in the audit log, but never distort your floor or ceiling spread.
          </div>
        </div>

        {/* Bento 3: Card (Span 1 col) */}
        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Domestic & Global
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Multi-Currency & Nigeria Support
            </h3>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Prioritizes Nigerian merchant listings in NGN when querying Nigerian markets, while seamlessly converting international cross-border supplier quotes.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-1.5 text-xs font-mono font-semibold text-slate-700">
            <span className="px-2 py-1 bg-slate-100 rounded-lg">NGN (₦)</span>
            <span className="px-2 py-1 bg-slate-100 rounded-lg">USD ($)</span>
            <span className="px-2 py-1 bg-slate-100 rounded-lg">EUR (€)</span>
            <span className="px-2 py-1 bg-slate-100 rounded-lg">GBP (£)</span>
          </div>
        </div>

        {/* Bento 4: Wide Card (Span 2 cols) */}
        <div className="md:col-span-2 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Evidence Integrity
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              100% Attributed Source Audit Trail
            </h3>
            <p className="mt-2.5 text-sm text-slate-600 max-w-xl leading-relaxed">
              Every data point in MarketProbe traces back to a live, verifiable merchant or distributor URL. No black-box guesses. You can click directly into vendor spec sheets and order pages to verify availability in real-time.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 pt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero hallucinated prices · Direct vendor catalog URLs · Preserved original currencies</span>
          </div>
        </div>
      </div>
    </section>
  );
};
