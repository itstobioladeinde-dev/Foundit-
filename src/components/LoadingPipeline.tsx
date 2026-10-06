import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, CircleDot } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
        <Loader2 className="w-5 h-5 text-slate-700 animate-spin shrink-0" />
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Researching market data for <span className="text-indigo-600">"{query}"</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Querying market catalogs, extracting item specs, and calculating price benchmarks...
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={step} className="flex items-center gap-3">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <CircleDot className="w-4 h-4 text-slate-900 shrink-0 animate-pulse" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}

              <span
                className={`text-sm transition-colors ${
                  isDone
                    ? 'text-slate-600'
                    : isCurrent
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
