import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { SearchSection } from './components/SearchSection';
import { LoadingPipeline } from './components/LoadingPipeline';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { MarketResultDashboard } from './components/MarketResultDashboard';
import { SearchStatus, MarketResearchResult } from './types/market';
import { searchProductApi } from './services/marketApi';

export default function App() {
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [result, setResult] = useState<MarketResearchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Ref to cancel in-flight network requests and guard against duplicate race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  const inFlightQueryRef = useRef<string | null>(null);

  const executeSearch = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    // Prevent duplicate submission if the exact same query is currently in flight
    if (status === 'loading' && inFlightQueryRef.current === trimmed) {
      return;
    }

    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    inFlightQueryRef.current = trimmed;

    setCurrentQuery(trimmed);
    setStatus('loading');
    setErrorMessage('');

    try {
      // Dispatch real network request to server-side endpoint
      const searchData = await searchProductApi(trimmed, controller.signal);
      setResult(searchData);
      setStatus('success');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Ignored because request was deliberately superseded by a newer one
        return;
      }
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(message);
      setStatus('error');
      setResult(null);
    } finally {
      if (inFlightQueryRef.current === trimmed) {
        inFlightQueryRef.current = null;
      }
    }
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    inFlightQueryRef.current = null;
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
            <span>Secure Server-Side API</span>
            <span>·</span>
            <span>Provider-Agnostic</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
