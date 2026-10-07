import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  query?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, query }) => {
  return (
    <div className="max-w-2xl mx-auto my-8 p-8 rounded-[24px] bg-gradient-to-b from-[#180a0a] to-[#120606] border border-rose-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] text-left">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-rose-400" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold block mb-1">
            RESEARCH INTERRUPTED
          </span>
          <h3 className="text-base font-bold text-white">Research Request Failed</h3>
          <p className="mt-1 text-sm text-slate-300 leading-relaxed">
            {message || 'An error occurred while attempting to fetch market data.'}
          </p>
          {query && (
            <p className="mt-2 text-xs text-slate-400 font-mono">
              Query attempted: <span className="text-[#ccff00]">"{query}"</span>
            </p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onRetry}
              className="px-5 py-2.5 rounded-full bg-[#ccff00] hover:bg-[#bbf246] active:scale-95 text-[#06130c] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.25)]"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[3]" />
              <span>Retry Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
