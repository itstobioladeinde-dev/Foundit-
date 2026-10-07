import React, { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Play,
  Layers,
  Globe2,
  Database,
  BarChart3,
  Radio,
  X,
  RotateCcw,
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
  isCompact?: boolean;
  onReset?: () => void;
  onExploreMethodology?: () => void;
}

const POPULAR_EXAMPLES = [
  '12mm marine plywood',
  'stainless steel pipe 2 inch',
  'cement board 1/2"',
  'Samsung A55 128GB',
  'commercial mesh task chair',
  'industrial safety helmet',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  isLoading,
  initialQuery = '',
  isCompact = false,
  onReset,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [validationError, setValidationError] = useState('');

  // Bug Fix 1: Synchronize query state whenever initialQuery changes from external action
  useEffect(() => {
    setQuery(initialQuery);
    if (validationError) setValidationError('');
  }, [initialQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setValidationError('Please enter a physical product, material, or hardware specification.');
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

  const handleClear = () => {
    setQuery('');
    setValidationError('');
    const input = document.getElementById('search-input');
    input?.focus();
  };

  const scrollToMethodology = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    const inputEl = document.getElementById('search-input');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputEl.focus();
    }
  };

  // Compact Mode: Rendered at top of Results/Loading view so results aren't pushed down
  if (isCompact) {
    return (
      <section className="pt-4 pb-6 px-4 bg-[#06130c] border-b border-emerald-950/80">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center bg-[#0a1d13]/90 hover:bg-[#0c2317] p-2 rounded-full border border-emerald-500/40 shadow-lg focus-within:border-[#ccff00] focus-within:shadow-[0_0_25px_rgba(204,255,0,0.25)] transition-all duration-300 backdrop-blur-xl"
          >
            <div className="pl-3.5 pr-2.5 text-emerald-400">
              <Search className="w-4 h-4 text-[#ccff00]" />
            </div>

            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (validationError) setValidationError('');
              }}
              disabled={isLoading}
              placeholder='Search any product or material...'
              className="w-full text-sm text-white placeholder:text-slate-400 bg-transparent outline-none py-1.5 px-1 focus:ring-0"
              maxLength={200}
              aria-label="Product or material search query"
            />

            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 mr-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-2.5 rounded-full bg-[#ccff00] hover:bg-[#bbf246] disabled:bg-slate-700 disabled:text-slate-400 text-[#06130c] font-black text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(204,255,0,0.25)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#06130c]" />
                  <span>RESEARCHING...</span>
                </>
              ) : (
                <>
                  <span>SEARCH</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {validationError && (
            <p className="mt-2 text-xs font-semibold text-rose-400 text-left pl-4" role="alert">
              {validationError}
            </p>
          )}

          {/* Prompt Suggestions Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
                Quick:
              </span>
              {POPULAR_EXAMPLES.slice(0, 4).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleChipClick(item)}
                  disabled={isLoading}
                  className="px-2.5 py-0.5 rounded-full bg-white/[0.06] hover:bg-[#ccff00]/15 hover:border-[#ccff00]/40 text-slate-300 hover:text-[#ccff00] transition-all border border-white/10 text-[11px] cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-[#ccff00] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Return to Home Radar</span>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Full Editorial Hero: Displayed on the Home/Idle view
  return (
    <section className="relative pt-6 pb-16 overflow-hidden bg-[#06130c] text-white">
      {/* Ambient background lighting & soft botanical/caustic gradients matching reference image */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-emerald-900/30 via-emerald-950/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-24 right-10 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(204,255,0,0.12)_0%,transparent_70%)] blur-[90px] pointer-events-none" />
      <div className="absolute top-48 left-10 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_70%)] blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Main Hero Split Grid: Editorial typography on left, 3D Data Pedestal visual on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center pt-4 pb-12">
          
          {/* Left Hero Column: Editorial text & headline */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Eyebrow with horizontal line (Exactly like "NEXT-GEN GADGETS ———" in reference image) */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#ccff00] font-mono">
                AI MARKET INTELLIGENCE
              </span>
              <div className="h-[1px] w-14 bg-gradient-to-r from-[#ccff00]/60 to-transparent" />
            </div>

            {/* Large Bold Headline with Italic/Serif emphasis (matching "Power Up Your World.") */}
            <h1 className="text-4xl sm:text-6xl md:text-[68px] font-extrabold tracking-tight leading-[1.05] text-[#fbfdfa] font-display">
              Uncover Real <br />
              <span className="font-serif italic font-normal text-[#ccff00] drop-shadow-[0_0_35px_rgba(204,255,0,0.25)]">
                Market Prices.
              </span>
            </h1>

            {/* Subtitle (Matching "Smart. Sleek. Reliable. Gadgets that keep you ahead.") */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              <span className="text-white font-medium">Accurate. Grounded. Independent.</span>
              <br className="hidden sm:inline" />
              {' '}Live web-grounded research for construction materials, industrial hardware, and physical commercial products.
            </p>

            {/* Hero CTAs: Bright Lime Pill + Methodology Video/Demo Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#search-bar"
                onClick={scrollToSearch}
                className="px-7 py-3.5 rounded-full bg-[#ccff00] hover:bg-[#bbf246] active:scale-95 text-[#06130c] font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(204,255,0,0.35)] transition-all duration-200 flex items-center gap-2 cursor-pointer group"
              >
                <span>SEARCH PRICES</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <button
                onClick={scrollToMethodology}
                className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white group p-1 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/15 border border-white/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-inner">
                  <Play className="w-4 h-4 text-[#ccff00] fill-[#ccff00] translate-x-0.5" />
                </div>
                <div className="text-left">
                  <span className="block text-white leading-tight">View Methodology</span>
                  <span className="text-[11px] text-slate-400 font-normal">How prices are verified</span>
                </div>
              </button>
            </div>

            {/* Benefit Icons Strip (Matching the 4 icons in the reference image) */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-[#ccff00]/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-[#ccff00]" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold block text-white">Verified</span>
                  <span className="text-slate-400">Sources</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-[#ccff00]/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3 h-3 text-[#ccff00]" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold block text-white">IQR Anomaly</span>
                  <span className="text-slate-400">Outlier Filter</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-[#ccff00]/30 flex items-center justify-center shrink-0">
                  <Globe2 className="w-3 h-3 text-[#ccff00]" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold block text-white">Multi-Currency</span>
                  <span className="text-slate-400">Global & NGN</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-[#ccff00]/30 flex items-center justify-center shrink-0">
                  <Database className="w-3 h-3 text-[#ccff00]" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold block text-white">Audit Trail</span>
                  <span className="text-slate-400">100% Attributed</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Sophisticated Price & Data Visualization on 3D Pedestal */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] sm:min-h-[420px]">
            
            {/* Concentric Thin Glowing Lime Rings (Signature visual from reference image) */}
            <div className="absolute w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] rounded-full border border-[#ccff00]/25 animate-pulse-ring pointer-events-none" />
            <div className="absolute w-[260px] sm:w-[300px] h-[260px] sm:h-[300px] rounded-full border border-emerald-400/20 pointer-events-none" />
            <div className="absolute w-[200px] sm:w-[220px] h-[200px] sm:h-[220px] rounded-full border border-[#ccff00]/15 pointer-events-none" />

            {/* Glowing background radial spot */}
            <div className="absolute w-72 h-72 rounded-full bg-[#ccff00]/15 blur-2xl pointer-events-none" />

            {/* The 3D Matte Dark Pedestal */}
            <div className="relative w-full max-w-[340px] pt-12 pb-6 flex flex-col items-center">
              
              {/* Floating Centerpiece: Holographic Price Intelligence Sphere */}
              <div className="relative z-20 w-44 h-44 rounded-full bg-gradient-to-tr from-[#05130b] via-[#0f2e1e] to-[#16412b] border border-[#ccff00]/40 shadow-[0_0_50px_rgba(204,255,0,0.25)] flex flex-col items-center justify-center p-4 text-center animate-float">
                
                {/* Internal radar scan ripple */}
                <div className="absolute inset-0 rounded-full border border-[#ccff00]/20 scale-90" />
                <div className="absolute inset-2 rounded-full border border-emerald-400/25 scale-75" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-[#ccff00] font-mono font-bold mb-0.5">
                    <Radio className="w-3 h-3 text-[#ccff00] animate-pulse" />
                    <span>BENCHMARK</span>
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                    $36.20
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium">
                    per 4x8 Marine Sheet
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/40 text-[9px] font-mono text-[#ccff00]">
                    <span>✓ High Conf. 98.4%</span>
                  </div>
                </div>
              </div>

              {/* Cylindrical Pedestal underneath */}
              <div className="relative -mt-10 z-10 w-64 h-16 rounded-[100%] bg-gradient-to-b from-[#133222] to-[#091b12] border-t-2 border-[#ccff00]/50 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-[#06140d] border-b border-emerald-900/60" />
                <div className="absolute top-1 inset-x-8 h-2 rounded-full bg-white/10 blur-[1px]" />
              </div>

              {/* Floating Badge 1 (Top Left): Live Attributed Suppliers */}
              <div className="absolute -left-4 sm:-left-6 top-6 z-30 animate-float bg-[#0a1f14]/90 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/30 shadow-xl text-left w-48">
                <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono mb-1">
                  <span>DISPERSION SPREAD</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                </div>
                <div className="text-xs font-bold text-white font-mono">$33.50 – $38.90</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-300 border-t border-white/10 pt-1">
                  <span>Grainger & McMaster</span>
                  <span className="text-[#ccff00] font-semibold">4 quotes</span>
                </div>
              </div>

              {/* Floating Badge 2 (Bottom Right): Verified Anomaly Rejection */}
              <div className="absolute -right-4 sm:-right-6 bottom-4 z-30 animate-float-delayed bg-[#0a1f14]/90 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/30 shadow-xl text-left w-52">
                <div className="flex items-center gap-1.5 text-[10px] text-[#ccff00] font-semibold mb-1">
                  <CheckCircle2 className="w-3 h-3 text-[#ccff00]" />
                  <span>IQR OUTLIER REJECTION</span>
                </div>
                <div className="text-[11px] text-slate-200 leading-tight">
                  Removed $350/sheet reseller markup from median pool.
                </div>
                <div className="mt-1.5 text-[9px] font-mono text-emerald-400 flex items-center justify-between">
                  <span>Status: Screened</span>
                  <span className="text-white font-bold">Defensible</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* PRIMARY HERO INTERACTION: Centered High-Impact Search Bar */}
        <div id="search-bar" className="mt-4 max-w-3xl mx-auto pt-4">
          
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center bg-[#0a1d13]/90 hover:bg-[#0c2317] p-2.5 rounded-full border border-emerald-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.6)] focus-within:border-[#ccff00] focus-within:shadow-[0_0_35px_rgba(204,255,0,0.25)] transition-all duration-300 backdrop-blur-xl"
          >
            <div className="pl-4 pr-3 text-emerald-400/80">
              <Search className="w-5 h-5 text-[#ccff00]" />
            </div>

            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (validationError) setValidationError('');
              }}
              disabled={isLoading}
              placeholder='Search any product or material: "12mm marine plywood", "stainless steel pipe 2 inch"...'
              className="w-full text-sm sm:text-base text-white placeholder:text-slate-400 bg-transparent outline-none py-2 px-1 focus:ring-0"
              maxLength={200}
              aria-label="Product or material search query"
            />

            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 mr-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 py-3 rounded-full bg-[#ccff00] hover:bg-[#bbf246] disabled:bg-slate-700 disabled:text-slate-400 text-[#06130c] font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#06130c]" />
                  <span>RESEARCHING...</span>
                </>
              ) : (
                <>
                  <span>RESEARCH PRICE</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Validation Notice */}
          {validationError && (
            <p className="mt-2.5 text-xs font-semibold text-rose-400 text-left pl-5" role="alert">
              {validationError}
            </p>
          )}

          {/* Prompt Suggestions Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 mr-1 text-[11px] uppercase tracking-wider font-semibold">
              Popular Searches:
            </span>
            {POPULAR_EXAMPLES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleChipClick(item)}
                disabled={isLoading}
                className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-[#ccff00]/15 hover:border-[#ccff00]/40 text-slate-200 hover:text-[#ccff00] transition-all border border-white/10 text-xs font-medium cursor-pointer"
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
