import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, CircleDot, Radar } from 'lucide-react';

interface LoadingPipelineProps {
  query: string;
}

const STEPS = [
  'Interpreting query & standard technical classifications',
  'Searching verified online sources & supplier catalogs',
  'Extracting technical specifications & source pricing',
  'Calculating benchmark price and variance range',
];

export const LoadingPipeline: React.FC<LoadingPipelineProps> = ({ query }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 600);
    const timer2 = setTimeout(() => setCurrentStep(2), 1200);
    const timer3 = setTimeout(() => setCurrentStep(3), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 rounded-[28px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-left relative overflow-hidden">
      {/* Background glow & subtle radar pulse */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(204,255,0,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex items-center gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="w-12 h-12 rounded-full bg-emerald-950 border border-[#ccff00]/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
          <Radar className="w-6 h-6 text-[#ccff00] animate-spin" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#ccff00]">
              RADAR ACTIVE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white leading-tight mt-0.5">
            Researching market data for <span className="text-[#ccff00]">"{query}"</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Querying distributor networks, extracting specifications, and computing IQR benchmark...
          </p>
        </div>
      </div>

      {/* Steps progress */}
      <div className="mt-6 space-y-4 relative z-10">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={step} className="flex items-center gap-3.5">
              {isDone ? (
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/20 border border-[#ccff00] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                </div>
              ) : isCurrent ? (
                <div className="w-5 h-5 rounded-full bg-emerald-950 border border-[#ccff00] flex items-center justify-center shrink-0 animate-pulse">
                  <CircleDot className="w-3.5 h-3.5 text-[#ccff00]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/15 shrink-0" />
              )}

              <span
                className={`text-xs sm:text-sm transition-colors ${
                  isDone
                    ? 'text-slate-300'
                    : isCurrent
                    ? 'text-white font-semibold'
                    : 'text-slate-500'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Shimmer skeleton bar preview */}
      <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5">
        <div className="h-3 w-3/4 rounded-full skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
};
