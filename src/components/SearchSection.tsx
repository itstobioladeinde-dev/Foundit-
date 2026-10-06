import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, AlertTriangle } from 'lucide-react';
import { SAMPLE_QUERIES } from '../data/mockData';
import { MAX_CLIENT_QUERY_LENGTH } from '../services/marketApi';

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
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state if initialQuery changes externally (e.g. sample suggestion clicked from empty state)
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate clicks while loading
    if (isLoading) return;

    const trimmed = query.trim();

    if (!trimmed) {
      setValidationError('Please enter a product, material, or equipment name.');
      return;
    }

    if (trimmed.length > MAX_CLIENT_QUERY_LENGTH) {
      setValidationError(`Query exceeds maximum limit of ${MAX_CLIENT_QUERY_LENGTH} characters.`);
      return;
    }

    setValidationError(null);
    onSearch(trimmed);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    setQuery(suggestion);
    setValidationError(null);
    onSearch(suggestion);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (validationError && val.trim().length > 0) {
      setValidationError(null);
    }
  };

  const handleClear = () => {
    setQuery('');
    setValidationError(null);
  };

  const isTooLong = query.trim().length > MAX_CLIENT_QUERY_LENGTH;

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
        <form onSubmit={handleSubmit} className="mt-8 text-left" noValidate>
          <div
            className={`relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white rounded-xl border-2 transition-all shadow-sm ${
              validationError || isTooLong
                ? 'border-rose-400 ring-2 ring-rose-100'
                : 'border-slate-300 focus-within:border-slate-800 focus-within:ring-4 focus-within:ring-slate-100'
            }`}
          >
            <div className="relative flex-1 flex items-center">
              <label htmlFor="search-input" className="sr-only">
                Search physical product, material, or equipment
              </label>
              <Search className="w-5 h-5 text-slate-400 ml-3.5 mr-2 shrink-0 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={handleChange}
                maxLength={MAX_CLIENT_QUERY_LENGTH + 50} // Allow slight typing so validation warning shows
                placeholder="E.g. 12mm plywood, Samsung A55, stainless steel pipe 2 inch..."
                disabled={isLoading}
                autoComplete="off"
                className="w-full py-3 pr-9 pl-1 text-base text-slate-900 placeholder:text-slate-400 bg-transparent border-0 focus:outline-none focus:ring-0 disabled:opacity-60"
              />

              {query && !isLoading && (
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
              disabled={!query.trim() || isTooLong || isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none shrink-0"
            >
              <span>{isLoading ? 'Sending Request...' : 'Search Market'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 text-slate-300" />}
            </button>
          </div>

          {/* Validation Feedback or Character Counter */}
          <div className="mt-2 flex items-center justify-between min-h-5 px-1 text-xs">
            {validationError ? (
              <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationError}</span>
              </div>
            ) : isTooLong ? (
              <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Query exceeds {MAX_CLIENT_QUERY_LENGTH} character limit ({query.length}/{MAX_CLIENT_QUERY_LENGTH})
                </span>
              </div>
            ) : (
              <span className="text-slate-400 text-[11px]">
                {query.length > 120 ? `${query.length}/${MAX_CLIENT_QUERY_LENGTH} characters` : ''}
              </span>
            )}
          </div>
        </form>

        {/* Example Search Suggestions */}
        <div className="mt-4 text-left">
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
