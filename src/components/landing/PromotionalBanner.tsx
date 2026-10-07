import React from 'react';
import { ArrowRight, Radar, Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PromotionalBannerProps {
  onSearchCTA: (sampleQuery: string) => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onSearchCTA }) => {
  return (
    <section className="py-12 max-w-6xl mx-auto px-4">
      {/* Wide Rounded Container matching the promotional card at bottom of reference image */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#0c2619] via-[#091e14] to-[#05110a] border border-emerald-500/30 p-8 sm:p-12 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        
        {/* Soft background radial lighting */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[radial-gradient(circle,rgba(204,255,0,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Visual: 3D Holographic Pedestal with Concentric Lime Rings */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[220px]">
            {/* Concentric rings matching reference image */}
            <div className="absolute w-56 h-56 rounded-full border border-[#ccff00]/25 animate-pulse-ring pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full border border-emerald-400/20 pointer-events-none" />
            <div className="absolute w-32 h-32 rounded-full border border-[#ccff00]/15 pointer-events-none" />

            {/* Glowing Center Pedestal & Floating Radar Node */}
            <div className="relative flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#05130b] via-[#103422] to-[#1a4a30] border border-[#ccff00]/50 shadow-[0_0_35px_rgba(204,255,0,0.3)] flex flex-col items-center justify-center p-3 animate-float text-center">
                <Radar className="w-7 h-7 text-[#ccff00] mb-1 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-white">LIVE CRAWL</span>
                <span className="text-[8px] font-mono text-[#ccff00]">99.8% Grounded</span>
              </div>

              {/* Cylindrical Pedestal */}
              <div className="relative -mt-6 z-0 w-44 h-12 rounded-[100%] bg-gradient-to-b from-[#143926] to-[#0a1f14] border-t-2 border-[#ccff00]/40 shadow-xl" />
            </div>
          </div>

          {/* Right Text Column: Eyebrow, Editorial Headline & Pill CTA */}
          <div className="lg:col-span-7 text-left space-y-4">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#ccff00] font-mono block">
              REAL-TIME COMMODITY RADAR
            </span>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
              High Volatility. <br />
              <span className="font-serif italic font-normal text-[#ccff00]">
                Defensible Benchmarks.
              </span>
            </h3>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              When market prices fluctuate across distributors, MarketProbe collects multi-source quotes, isolates bulk-order skew, and calculates an actionable floor, median, and ceiling.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onSearchCTA('stainless steel pipe 2 inch')}
                className="px-7 py-3.5 rounded-full bg-[#ccff00] hover:bg-[#bbf246] active:scale-95 text-[#06130c] font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(204,255,0,0.35)] transition-all duration-200 flex items-center gap-2 cursor-pointer group"
              >
                <span>SEARCH PRICES NOW</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Zero speculative projections</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
