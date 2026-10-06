import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export const LargeCounterSection: React.FC<{ onSearchCTA: () => void }> = ({ onSearchCTA }) => {
  const { elementRef, count } = useCountUp(145, 1800);

  return (
    <section className="py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-6">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>PROVEN COST PREVENTION IMPACT</span>
        </span>

        <div ref={elementRef} className="my-4">
          <div className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold text-slate-900 tracking-tight font-mono tabular-nums">
            ${count}M+
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-4 max-w-xl mx-auto">
          In Physical Material & Commercial Hardware Decisions Benchmarked
        </h3>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Contractors, procurement teams, and commercial buyers use MarketProbe to independently verify subcontractor quotes, spot supplier price gouging, and secure defensible market rates.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSearchCTA}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            <span>Start a Free Market Benchmark</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
