import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export const LargeCounterSection: React.FC<{ onSearchCTA: () => void }> = ({ onSearchCTA }) => {
  const { elementRef, count } = useCountUp(145, 1800);

  return (
    <section className="py-24 bg-[#07160e] border-b border-emerald-950/80 text-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-emerald-950/90 text-[#ccff00] border border-[#ccff00]/30 mb-6 font-mono">
          <TrendingUp className="w-3.5 h-3.5 text-[#ccff00]" />
          <span>PROVEN COST PREVENTION IMPACT</span>
        </span>

        <div ref={elementRef} className="my-4">
          <div className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight font-mono tabular-nums text-white drop-shadow-[0_0_50px_rgba(204,255,0,0.2)]">
            $<span className="text-[#ccff00]">{count}</span>M+
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 max-w-xl mx-auto font-display">
          In Physical Material & Commercial Hardware Decisions Benchmarked
        </h3>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Contractors, procurement teams, and commercial buyers use MarketProbe to independently verify subcontractor quotes, spot supplier price gouging, and secure defensible market rates.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSearchCTA}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#ccff00] hover:bg-[#bbf246] active:scale-95 text-[#06130c] font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(204,255,0,0.35)] transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start a Free Market Benchmark</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
