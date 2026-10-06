import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, ShieldCheck, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const POPULAR_EXAMPLES = [
  '12mm marine plywood',
  'stainless steel pipe 2 inch',
  'cement board',
  'office chair',
  'Samsung A55 128GB',
  'industrial safety helmet',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  isLoading,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [validationError, setValidationError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setValidationError('Please enter a product, material, or equipment specification.');
      return;
    }
    if (trimmed.length > 200) {
      setValidationError('Query exceeds maximum limit of 200 characters.');
      return;
    }
    setValidationError('');
    onSearch(trimmed);
  };

  const handleChipClick = (item: string) => {
    setQuery(item);
    setValidationError('');
    onSearch(item);
  };

  return (
    <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-[#fafaf9] via-white to-[#fafaf9]">
      {/* Decorative subtle background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-100/40 via-emerald-100/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Container */}
      <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
        {/* Floating Card 1 (Left): Sample Price Result */}
        <div className="hidden lg:block absolute -left-12 top-28 z-20 animate-float pointer-events-none">
          <div className="p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg text-left w-64">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">Structural Wood</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>High Conf.</span>
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">12mm Marine Plywood</div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-slate-900">$36.00</span>
              <span className="text-[11px] text-slate-400 font-mono">/ 4x8 sheet</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono flex justify-between border-t border-slate-100 pt-1.5">
              <span>Spread: $34 – $38</span>
              <span className="text-indigo-600 font-medium">4 sources</span>
            </div>
          </div>
        </div>

        {/* Floating Card 2 (Right): Live Citation & Range */}
        <div className="hidden lg:block absolute -right-12 top-40 z-20 animate-float-delayed pointer-events-none">
          <div className="p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg text-left w-60">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Attributed Evidence</span>
            </div>
            <div className="text-xs font-bold text-slate-900">McMaster & Grainger</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Live catalog quotes verified without extrapolation.</p>
            <div className="mt-2.5 px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[10px] font-mono text-slate-600 flex items-center justify-between">
              <span>Status: Grounded</span>
              <span className="text-emerald-700 font-bold">100% Attributed</span>
            </div>
          </div>
        </div>

        {/* Small pill label above section title */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100/90 text-slate-800 border border-slate-200/80 mb-6 shadow-2xs hover:bg-slate-200/70 transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>TEXT-SEARCH PHYSICAL PRODUCT & COMMODITY RADAR</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-slate-950 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Real Market Prices for Physical Goods. <br className="hidden sm:inline" />
          <span className="italic text-slate-800 font-normal">Backed by Real Sources.</span>
        </h1>

        {/* Short Subtext */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Type any product, material, or equipment specification. MarketProbe autonomously researches distributor catalogs to calculate verified market ranges, median benchmarks, and source links.
        </p>

        {/* Large Centered Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center bg-white p-2 rounded-2xl sm:rounded-3xl border border-slate-300/90 shadow-md hover:shadow-lg focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all duration-200"
          >
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-slate-500" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (validationError) setValidationError('');
              }}
              disabled={isLoading}
              placeholder='Try "12mm marine plywood", "stainless steel pipe 2 inch", "office chair"...'
              className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none py-2 px-1 focus:ring-0"
              maxLength={200}
              aria-label="Product or material search query"
            />

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-3 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <span>Research Price</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Validation Notice if any */}
          {validationError && (
            <p className="mt-2 text-xs font-medium text-rose-600 text-left pl-3" role="alert">
              {validationError}
            </p>
          )}

          {/* Prompt Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1 font-medium">Popular Searches:</span>
            {POPULAR_EXAMPLES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleChipClick(item)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-slate-100/90 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200/70 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
