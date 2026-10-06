import React from 'react';
import { ShieldCheck, Radar, ArrowUpRight, TrendingUp, Cpu, Award } from 'lucide-react';

export const DarkContrastingSection: React.FC<{ onSearchExample: (q: string) => void }> = ({
  onSearchExample,
}) => {
  const liveTickerItems = [
    {
      item: '12mm Marine Plywood (BS1088)',
      category: 'Structural Wood',
      median: '$36.20',
      spread: '$33.50 – $38.90',
      confidence: 'High',
      sourceCount: 4,
    },
    {
      item: 'Stainless Steel Pipe 2" Sch 40 (304)',
      category: 'Process Piping',
      median: '$218.40',
      spread: '$195.00 – $240.00',
      confidence: 'High',
      sourceCount: 3,
    },
    {
      item: 'Samsung Galaxy A55 5G 128GB',
      category: 'Commercial Hardware',
      median: '$349.00',
      spread: '$319.00 – $385.00',
      confidence: 'High',
      sourceCount: 5,
    },
    {
      item: 'Commercial Mesh Task Chair (ANSI/BIFMA)',
      category: 'Office & Facilities',
      median: '$240.00',
      spread: '$210.00 – $285.00',
      confidence: 'Medium',
      sourceCount: 4,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#06120b] via-[#091b11] to-[#050e09] text-white relative overflow-hidden border-y border-emerald-950/80">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 mb-4">
              <Radar className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE INDUSTRIAL COMMODITY RADAR</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
              Enterprise Procurement Intelligence in High Contrast.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              When market prices shift due to supply shocks, tariff modifications, or local retailer markups, MarketProbe crawls live supplier indexes to report verified figures.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>CRAWLER STATUS: ONLINE</span>
            </div>
            <span>·</span>
            <span>UNTRUSTED ISOLATION: ACTIVE</span>
          </div>
        </div>

        {/* Live Radar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {liveTickerItems.map((ticker, idx) => (
            <div
              key={idx}
              onClick={() => onSearchExample(ticker.item.split('(')[0].trim())}
              className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer backdrop-blur-md hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-emerald-400/90 mb-2">
                  <span>{ticker.category}</span>
                  <span className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-300 transition-colors">
                    <span>Analyze</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors line-clamp-2">
                  {ticker.item}
                </h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                    {ticker.median}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">benchmark</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">{ticker.spread}</span>
                <span className="text-emerald-400 font-medium">✓ {ticker.confidence}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-slate-200">
              <strong>Verified Procurement Guarantee: </strong>
              MarketProbe never projects speculative futures or fabricated averages. If 0 sources are verified, it declares price unavailable.
            </span>
          </div>

          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            Launch Search Above →
          </button>
        </div>
      </div>
    </section>
  );
};
