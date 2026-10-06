import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SearchSection } from './components/SearchSection';
import { LoadingPipeline } from './components/LoadingPipeline';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { MarketResultDashboard } from './components/MarketResultDashboard';
import { SearchStatus, MarketResearchResult } from './types/market';
import { getMockResearchResult } from './data/mockData';

export default function App() {
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [result, setResult] = useState<MarketResearchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const executeSearch = (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    setCurrentQuery(trimmed);
    setStatus('loading');
    setErrorMessage('');

    // Simulate pipeline timing to demonstrate multi-step research progress
    setTimeout(() => {
      try {
        const mockResult = getMockResearchResult(trimmed);
        setResult(mockResult);
        setStatus('success');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to retrieve research data.';
        setErrorMessage(message);
        setStatus('error');
      }
    }, 1800);
  };

  const handleReset = () => {
    setCurrentQuery('');
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
  };

  const handleRetry = () => {
    if (currentQuery) {
      executeSearch(currentQuery);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-slate-200">
      {/* Navigation Header */}
      <Navbar onReset={handleReset} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Search Header / Omnibox */}
        <SearchSection
          onSearch={executeSearch}
          isLoading={status === 'loading'}
          initialQuery={currentQuery}
        />

        {/* State Display Router */}
        {status === 'loading' && (
          <LoadingPipeline query={currentQuery} />
        )}

        {status === 'error' && (
          <ErrorState
            message={errorMessage}
            onRetry={handleRetry}
            query={currentQuery}
          />
        )}

        {status === 'success' && result && (
          <MarketResultDashboard
            result={result}
            onNewSearch={handleReset}
          />
        )}

        {status === 'idle' && (
          <EmptyState onSelectQuery={executeSearch} />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>MarketProbe © 2026 · Evidence-based physical item market intelligence</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Text-search only</span>
            <span>·</span>
            <span>No image processing</span>
            <span>·</span>
            <span>Prototype preview</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
