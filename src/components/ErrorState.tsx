import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  query?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, query }) => {
  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-red-50/70 border border-red-200 rounded-xl text-left">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900">Research Request Failed</h3>
          <p className="mt-1 text-sm text-red-700 leading-relaxed">
            {message || 'An error occurred while attempting to fetch market data.'}
          </p>
          {query && (
            <p className="mt-1 text-xs text-red-600">
              Query attempted: <span className="font-mono font-medium">"{query}"</span>
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
