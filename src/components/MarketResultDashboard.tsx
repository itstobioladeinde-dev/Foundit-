import React, { useState } from 'react';
import { MarketResearchResult, ConfidenceLevel } from '../types/market';
import {
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  Building2,
  Tag,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Radar,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface MarketResultDashboardProps {
  result: MarketResearchResult;
  onNewSearch: () => void;
}

const renderConfidenceBadge = (confidence: ConfidenceLevel, reason: string) => {
  if (confidence === 'high') {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-[#ccff00] bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-[#ccff00]/40 font-mono">
        <ShieldCheck className="w-4 h-4 text-[#ccff00] shrink-0" />
        <span className="font-bold uppercase tracking-wider">High Confidence</span>
        <span className="text-emerald-500">·</span>
        <span className="text-slate-300 font-sans">{reason}</span>
      </div>
    );
  }
  if (confidence === 'medium') {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-amber-300 bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-500/40 font-mono">
        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-bold uppercase tracking-wider">Moderate Confidence</span>
        <span className="text-amber-500">·</span>
        <span className="text-slate-300 font-sans">{reason}</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 text-xs text-rose-300 bg-rose-950/60 px-3.5 py-1.5 rounded-full border border-rose-500/40 font-mono">
      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
      <span className="font-bold uppercase tracking-wider">Low Confidence</span>
      <span className="text-rose-500">·</span>
      <span className="text-slate-300 font-sans">{reason}</span>
    </div>
  );
};

export const MarketResultDashboard: React.FC<MarketResultDashboardProps> = ({
  result,
  onNewSearch,
}) => {
  const [copied, setCopied] = useState(false);
  const {
    priceEstimate,
    specifications,
    brandsOrVariants,
    assumptions,
    uncertaintyNotes,
    pricingIntelligence,
    researchRecords,
    disclaimer,
  } = result;

  const isPriceAvailable = priceEstimate.isPriceAvailable !== false && priceEstimate.benchmarkPrice !== null;
  const isSingleQuote = priceEstimate.quoteCount === 1;

  const handleCopySummary = () => {
    const lines = [
      `Product: ${result.productName}`,
      `Category: ${result.category}`,
      result.brand ? `Brand: ${result.brand}` : null,
      result.model ? `Model: ${result.model}` : null,
      isPriceAvailable
        ? `Estimated Price: ${priceEstimate.formattedBenchmark} (${priceEstimate.formattedRange})`
        : 'Estimated Price: Unavailable online',
      `Confidence: ${priceEstimate.confidence.toUpperCase()}`,
      `Verified Quotes: ${priceEstimate.quoteCount}`,
      `Researched: ${result.researchedAt}`,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const observations = pricingIntelligence?.priceObservations || [];
  const hasObservations = observations.length > 0;

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 text-left space-y-6 text-white">
      
      {/* 1. PRODUCT IDENTIFICATION HEADER */}
      <section className="p-7 sm:p-9 rounded-[26px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Ambient radial glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(204,255,0,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
          <div className="flex-1">
            {/* Category & Timestamp */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mb-2 font-mono">
              <span className="font-bold text-[#ccff00] uppercase tracking-wider">{result.category}</span>
              <span aria-hidden="true" className="text-white/20">·</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{result.researchedAt}</span>
              </span>
            </div>

            {/* Product Name with large editorial display typography */}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
              {result.productName}
            </h2>

            {/* Brand / Model / Material identification pills */}
            {(result.brand || result.model || result.interpretation?.material) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {result.brand && (
                  <span className="bg-white/10 text-white font-medium px-3 py-1 rounded-full border border-white/15">
                    Brand: <strong className="text-[#ccff00]">{result.brand}</strong>
                  </span>
                )}
                {result.model && (
                  <span className="bg-white/10 text-white font-medium px-3 py-1 rounded-full border border-white/15">
                    Model: <strong className="text-white">{result.model}</strong>
                  </span>
                )}
                {result.interpretation?.material && (
                  <span className="bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/15">
                    Material: <strong className="text-white">{result.interpretation.material}</strong>
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="mt-4 text-sm text-slate-300 max-w-3xl leading-relaxed">
              {result.description}
            </p>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2.5 shrink-0">
            <button
              onClick={onNewSearch}
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#06130c] hover:bg-[#ccff00] px-4 py-2 rounded-full border border-white/20 hover:border-[#ccff00] transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Search</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#06130c] hover:bg-[#ccff00] px-4 py-2 rounded-full border border-white/20 hover:border-[#ccff00] transition-all cursor-pointer shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Confidence Row */}
        <div className="mt-6 pt-5 border-t border-white/10 relative z-10">
          {renderConfidenceBadge(priceEstimate.confidence, priceEstimate.confidenceReason)}
        </div>
      </section>

      {/* 2. ESTIMATED PRICE HERO SECTION */}
      {isPriceAvailable ? (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Benchmark Card (Span 5 cols) */}
          <div className="lg:col-span-5 p-7 rounded-[26px] bg-gradient-to-br from-[#0c281a] via-[#091f14] to-[#06150d] border border-[#ccff00]/40 shadow-[0_15px_45px_rgba(204,255,0,0.12)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(204,255,0,0.15)_0%,transparent_70%)] pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#ccff00] uppercase tracking-widest font-mono block">
                  ESTIMATED BENCHMARK
                </span>
                <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  {priceEstimate.currency}
                </span>
              </div>

              {/* Huge Price Number */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-mono tabular-nums text-white drop-shadow-[0_0_35px_rgba(204,255,0,0.3)]">
                  {priceEstimate.formattedBenchmark}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-300">
                Unit basis: <span className="text-[#ccff00] font-semibold">{priceEstimate.unitOfMeasure}</span>
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between font-mono">
              <span>Verified Quotes:</span>
              <span className="text-white font-bold bg-[#ccff00]/15 text-[#ccff00] px-2.5 py-1 rounded-full border border-[#ccff00]/30">
                {priceEstimate.quoteCount} {priceEstimate.quoteCount === 1 ? 'quote' : 'quotes'}
              </span>
            </div>
          </div>

          {/* Range Spread Card (Span 7 cols) */}
          <div className="lg:col-span-7 p-7 rounded-[26px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                  OBSERVED MARKET RANGE
                </span>
                <span className="text-xs text-[#ccff00] font-mono">
                  Unit: {priceEstimate.unitOfMeasure}
                </span>
              </div>

              {/* Single quote alert */}
              {isSingleQuote && (
                <div className="mb-4 p-3 rounded-xl bg-amber-950/50 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Single Online Quote: </strong>Benchmark is currently anchored to 1 online vendor quotation. Multi-merchant spread is pending additional catalog listings.
                  </span>
                </div>
              )}

              {/* 3-Column Price Distribution */}
              <div className="grid grid-cols-3 gap-3 text-center my-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Market Floor
                  </span>
                  <span className="text-base sm:text-xl font-bold text-white font-mono tabular-nums mt-1 block">
                    {priceEstimate.rangeMin !== null
                      ? `${priceEstimate.currency === 'USD' ? '$' : priceEstimate.currency === 'NGN' ? '₦' : `${priceEstimate.currency} `}${priceEstimate.rangeMin.toLocaleString()}`
                      : 'N/A'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Competitive floor</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e2c1c] border border-[#ccff00]/40 shadow-inner">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#ccff00] font-bold block">
                    Median Benchmark
                  </span>
                  <span className="text-base sm:text-xl font-bold text-white font-mono tabular-nums mt-1 block">
                    {priceEstimate.formattedBenchmark}
                  </span>
                  <span className="text-[10px] text-[#ccff00] font-mono mt-1 block">Median point</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Market Ceiling
                  </span>
                  <span className="text-base sm:text-xl font-bold text-white font-mono tabular-nums mt-1 block">
                    {priceEstimate.rangeMax !== null
                      ? `${priceEstimate.currency === 'USD' ? '$' : priceEstimate.currency === 'NGN' ? '₦' : `${priceEstimate.currency} `}${priceEstimate.rangeMax.toLocaleString()}`
                      : 'N/A'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">Retail / high tier</span>
                </div>
              </div>
            </div>

            {/* Visual Range bar with bright lime track */}
            {priceEstimate.rangeMin !== null && priceEstimate.rangeMax !== null && !isSingleQuote && (
              <div className="mt-5 pt-3 border-t border-white/10">
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden flex relative p-0.5">
                  <div className="bg-emerald-600/60 w-1/4 h-full rounded-l-full" />
                  <div className="bg-[#ccff00] w-2/4 h-full shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                  <div className="bg-emerald-600/60 w-1/4 h-full rounded-r-full" />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
                  <span>Floor: {priceEstimate.rangeMin.toLocaleString()}</span>
                  <span className="text-[#ccff00] font-bold">Empirical Spread</span>
                  <span>Ceiling: {priceEstimate.rangeMax.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* NO-PRICE STATE */
        <section className="p-8 rounded-[24px] bg-[#0c1f15] border border-emerald-500/30 text-left">
          <div className="flex items-start gap-3.5">
            <AlertCircle className="w-6 h-6 text-[#ccff00] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-white">
                Price Currently Unavailable Online
              </h3>
              <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                No verified public price quotes were discovered across retailer or distributor catalogs for this item. 
                Suppliers may require direct requests for quotation (RFQ), trade registration, or formal commercial invoicing.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400 font-mono">
                <span>Product specifications and known vendor channels remain documented below.</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. SPECIFICATIONS & COMMERCIAL VARIANTS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specifications Table (2 cols) */}
        <div className="lg:col-span-2 p-7 rounded-[26px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 shadow-md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <Tag className="w-4 h-4 text-[#ccff00]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Technical Specifications & Properties
            </h3>
          </div>

          {specifications.length > 0 ? (
            <div className="divide-y divide-white/5">
              {specifications.map((spec) => (
                <div key={spec.label} className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1 sm:gap-4">
                  <span className="text-slate-400 font-mono sm:w-1/3 shrink-0">
                    {spec.label}
                  </span>
                  <span className="text-white font-medium sm:w-2/3 text-left">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-4">
              No detailed numerical specifications recorded in current catalog records.
            </p>
          )}
        </div>

        {/* Possible Brands or Variants (1 col) */}
        <div className="p-7 rounded-[26px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <Building2 className="w-4 h-4 text-[#ccff00]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Known Brands & Commercial Variants
              </h3>
            </div>

            {brandsOrVariants.length > 0 ? (
              <ul className="space-y-2.5 text-xs">
                {brandsOrVariants.map((variant) => (
                  <li key={variant} className="flex items-start gap-2 text-slate-200">
                    <span className="text-[#ccff00] mt-0.5">•</span>
                    <span>{variant}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No specific commercial brand variants recorded.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 font-mono">
            Pricing varies substantially between proprietary formulations and generic equivalents.
          </div>
        </div>
      </section>

      {/* 4. SOURCE PRICES & CITATIONS SECTION */}
      <section className="p-7 sm:p-8 rounded-[26px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 shadow-md">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Source Prices & Vendor Observations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific seller listings and catalog entries used to synthesize market intelligence.
            </p>
          </div>
          <span className="text-xs text-[#ccff00] font-mono">
            {hasObservations ? observations.length : result.sourceQuotes.length} quotes retrieved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono">
                <th className="py-3 pr-4">Product / Source Title</th>
                <th className="py-3 px-4">Seller / Site</th>
                <th className="py-3 px-4">Listed Price</th>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4">Match Category</th>
                <th className="py-3 pl-4 text-right">Source Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {hasObservations
                ? observations.map((obs, idx) => (
                    <tr key={idx} className={obs.isOutlier ? 'bg-amber-950/20 text-slate-400' : 'hover:bg-white/[0.04] transition-colors'}>
                      <td className="py-3.5 pr-4 font-semibold text-white max-w-xs">
                        <div className="truncate">{obs.productTitle}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {obs.seller || obs.source}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                        {obs.originalCurrency === 'USD' ? '$' : obs.originalCurrency === 'NGN' ? '₦' : `${obs.originalCurrency} `}
                        {obs.originalPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {obs.originalCurrency}
                      </td>
                      <td className="py-3.5 px-4">
                        {obs.isOutlier ? (
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                            Outlier Excluded
                          </span>
                        ) : obs.isExactMatch ? (
                          <span className="text-[10px] font-mono font-bold text-[#ccff00] bg-emerald-950/80 border border-[#ccff00]/40 px-2.5 py-0.5 rounded-full">
                            Exact Match
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-medium text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                            Variant Match
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <a
                          href={obs.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#ccff00] hover:text-white font-semibold transition-colors bg-white/5 hover:bg-[#ccff00] hover:text-[#06130c] px-3 py-1 rounded-full border border-white/10"
                        >
                          <span>Visit Source</span>
                          <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                        </a>
                      </td>
                    </tr>
                  ))
                : result.sourceQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-white max-w-xs">
                        <div className="truncate">{quote.notes || quote.sellerOrSource}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {quote.sellerOrSource}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                        {quote.formattedPrice}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {quote.currency}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 capitalize font-mono text-[11px]">
                        {quote.sourceType}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <a
                          href={quote.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#ccff00] hover:text-white font-semibold transition-colors bg-white/5 hover:bg-[#ccff00] hover:text-[#06130c] px-3 py-1 rounded-full border border-white/10"
                        >
                          <span>Visit Source</span>
                          <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                        </a>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. IMPORTANT NOTICES, DISCLAIMERS & LIMITATIONS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Price-Change Disclaimer */}
        <div className="p-6 rounded-[22px] bg-[#081810] border border-emerald-500/20 text-xs">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
            <span>Price-Change Disclaimer & Assumptions</span>
          </h4>
          <p className="text-slate-300 leading-relaxed mb-3">
            {disclaimer || 'Prices reflect recent public supplier observations and are subject to real-time market shifts, local taxes, freight, and vendor stock fluctuations.'}
          </p>
          {assumptions.length > 0 && (
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              {assumptions.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Identification Uncertainty */}
        <div className="p-6 rounded-[22px] bg-[#081810] border border-emerald-500/20 text-xs">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2 font-mono">
            <Info className="w-4 h-4 text-[#ccff00]" />
            <span>Identification Uncertainty & Limitations</span>
          </h4>
          {uncertaintyNotes.length > 0 ? (
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              {uncertaintyNotes.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 italic">No significant specification ambiguities detected for this query.</p>
          )}
        </div>
      </section>

    </div>
  );
};
