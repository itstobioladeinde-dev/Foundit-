import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { CategoryShowcase } from './components/landing/CategoryShowcase';
import { PromotionalBanner } from './components/landing/PromotionalBanner';
import { TrustedSourcesStrip } from './components/landing/TrustedSourcesStrip';
import { StatsRow } from './components/landing/StatsRow';
import { HowItWorks } from './components/landing/HowItWorks';
import { FeaturesBentoGrid } from './components/landing/FeaturesBentoGrid';
import { DarkContrastingSection } from './components/landing/DarkContrastingSection';
import { LargeCounterSection } from './components/landing/LargeCounterSection';
import { Footer } from './components/landing/Footer';
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

    // Smoothly scroll to the top to see the loading pipeline or results
    window.scrollTo({ top: 0, behavior: 'smooth' });

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    if (currentQuery) {
      executeSearch(currentQuery);
    }
  };

  return (
    <div className="min-h-screen bg-[#06130c] flex flex-col font-sans text-white antialiased selection:bg-[#ccff00] selection:text-[#06130c]">
      {/* Navigation Header with Floating Pill */}
      <Navbar
        onReset={handleReset}
        onNewSearchClick={() => {
          handleReset();
          document.getElementById('search-input')?.focus();
        }}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* 1. Hero with editorial typography, centered search bar & 3D data pedestal */}
        <HeroSection
          onSearch={executeSearch}
          isLoading={status === 'loading'}
          initialQuery={currentQuery}
        />

        {/* 2. Loading State */}
        {status === 'loading' && (
          <div className="py-8">
            <LoadingPipeline query={currentQuery} />
          </div>
        )}

        {/* 3. Error State with Retry */}
        {status === 'error' && (
          <div className="py-8">
            <ErrorState
              message={errorMessage}
              onRetry={handleRetry}
              query={currentQuery}
            />
          </div>
        )}

        {/* 4. Results View */}
        {status === 'success' && result && (
          <div className="py-4">
            <MarketResultDashboard
              result={result}
              onNewSearch={handleReset}
            />
          </div>
        )}

        {/* 5. Landing Page Sections (When in Idle State or below results) */}
        {status === 'idle' && (
          <>
            {/* Trusted-by / Sources Strip */}
            <TrustedSourcesStrip />

            {/* Category Showcase: Direct translation of "Shop By Category" 5 vertical cards */}
            <CategoryShowcase onSelectCategory={executeSearch} />

            {/* Promotional Banner: Direct translation of "New Arrival: Small Size. Big Performance." card */}
            <PromotionalBanner onSearchCTA={executeSearch} />

            {/* Stats Row with Soft Cards & Count-Up */}
            <StatsRow />

            {/* How It Works (Search, AI research, Price estimate) */}
            <HowItWorks />

            {/* Features in Bento Grid Layout */}
            <FeaturesBentoGrid />

            {/* Dark Contrasting Section (Commodity Tickers) */}
            <DarkContrastingSection onSearchExample={executeSearch} />

            {/* Large Number Counter Section ($145M+) */}
            <LargeCounterSection
              onSearchCTA={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.getElementById('search-input')?.focus();
              }}
            />

            {/* Category Discovery & Persisted Database History */}
            <EmptyState onSelectQuery={executeSearch} />
          </>
        )}
      </main>

      {/* Modern Minimal SaaS Footer */}
      <Footer />
    </div>
  );
}
