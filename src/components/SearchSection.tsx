import React, { useState } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SAMPLE_QUERIES } from '../data/mockData';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  isLoading,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query.trim());
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <section className="pt-8 pb-6 sm:pt-12 sm:pb-8">
      <div className="max-w-3xl mx-auto text-center px-4">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight text-balance leading-tight sm:leading-tight">
          Market-price estimates & specs for any physical item
        </h1>

        {/* Short Supporting Description */}
        <p className="mt-3.5 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Search by typing a material name, industrial component, or consumer product. 
          Get realistic price benchmarks, technical specifications, and cited vendor sources.
        </p>

        {/* Main Search Form */}
        <form onSubmit={handleSubmit} className="mt-8 text-left">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white rounded-xl border-2 border-slate-300 focus-within:border-slate-800 focus-within:ring-4 focus-within:ring-slate-100 shadow-sm transition-all">
            <div className="relative flex-1 flex items-center">
              <label htmlFor="search-input" className="sr-only">
                Search physical product, material, or equipment
              </label>
              <Search className="w-5 h-5 text-slate-400 ml-3.5 mr-2 shrink-0 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g. 12mm plywood, Samsung A55, stainless steel pipe 2 inch..."
                disabled={isLoading}
                autoComplete="off"
                className="w-full py-3 pr-9 pl-1 text-base text-slate-900 placeholder:text-slate-400 bg-transparent border-0 focus:outline-none focus:ring-0 disabled:opacity-60"
              />

              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none shrink-0"
            >
              <span>{isLoading ? 'Researching...' : 'Search Market'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 text-slate-300" />}
            </button>
          </div>
        </form>

        {/* Example Search Suggestions */}
        <div className="mt-5 text-left">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Try an example query:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {SAMPLE_QUERIES.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="inline-flex items-center text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 hover:text-slate-900 px-3 py-1.5 rounded-md border border-slate-200/70 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Text-search only guarantee note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Text-query research only</span>
          <span aria-hidden="true">·</span>
          <span>No image uploads required</span>
          <span aria-hidden="true">·</span>
          <span>Never guesses unsupported prices</span>
        </div>
      </div>
    </section>
  );
};
