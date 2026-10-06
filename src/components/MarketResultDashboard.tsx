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
} from 'lucide-react';

interface MarketResultDashboardProps {
  result: MarketResearchResult;
  onNewSearch: () => void;
}

const renderConfidenceBadge = (confidence: ConfidenceLevel, reason: string) => {
  if (confidence === 'high') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200/60">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-semibold">High Confidence</span>
        <span className="text-emerald-400">·</span>
        <span className="text-emerald-700">{reason}</span>
      </div>
    );
  }
  if (confidence === 'medium') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-200/60">
        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-semibold">Moderate Confidence</span>
        <span className="text-amber-400">·</span>
        <span className="text-amber-700">{reason}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-xs text-rose-800 bg-rose-50/80 px-2.5 py-1 rounded-md border border-rose-200/60">
      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
      <span className="font-semibold">Low Confidence</span>
      <span className="text-rose-400">·</span>
      <span className="text-rose-700">{reason}</span>
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

  // Compile unified source quotes: prioritize real price observations or research records
  const observations = pricingIntelligence?.priceObservations || [];
  const hasObservations = observations.length > 0;

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 text-left space-y-6">
      {/* 1. PRODUCT IDENTIFICATION HEADER */}
      <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            {/* Category & Timestamp */}
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mb-2">
              <span className="font-medium text-slate-700">{result.category}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{result.researchedAt}</span>
              </span>
            </div>

            {/* Product Name */}
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-tight">
              {result.productName}
            </h2>

            {/* Brand / Model identification row */}
            {(result.brand || result.model || result.interpretation?.material) && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                {result.brand && (
                  <span className="bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded border border-slate-200">
                    Brand: {result.brand}
                  </span>
                )}
                {result.model && (
                  <span className="bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded border border-slate-200">
                    Model: {result.model}
                  </span>
                )}
                {result.interpretation?.material && (
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    Material: {result.interpretation.material}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="mt-3 text-sm text-slate-600 max-w-3xl leading-relaxed">
              {result.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              onClick={onNewSearch}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>New Search</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Confidence Row */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          {renderConfidenceBadge(priceEstimate.confidence, priceEstimate.confidenceReason)}
        </div>
      </section>

      {/* 2. ESTIMATED PRICE SECTION */}
      {isPriceAvailable ? (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Benchmark Card */}
          <div className="p-6 bg-slate-900 text-white rounded-xl shadow-xs md:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                  Estimated Market Price
                </span>
                <span className="text-[11px] font-mono text-slate-300">
                  {priceEstimate.currency}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight font-mono tabular-nums text-white">
                  {priceEstimate.formattedBenchmark}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-300">
                Unit basis: <span className="text-white font-medium">{priceEstimate.unitOfMeasure}</span>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Verified Sources:</span>
              <span className="text-slate-200 font-semibold font-mono tabular-nums">
                {priceEstimate.quoteCount} {priceEstimate.quoteCount === 1 ? 'quote' : 'quotes'}
              </span>
            </div>
          </div>

          {/* Range Spread Card */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-2xs md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Observed Market Range
                </span>
                <span className="text-xs text-slate-500">
                  Unit: {priceEstimate.unitOfMeasure}
                </span>
              </div>

              {/* Partial Result / Single Quote Notice */}
              {isSingleQuote && (
                <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start gap-2 text-xs text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Limited Data: </strong>Benchmark is currently anchored to 1 online vendor quotation. Multi-merchant spread is pending additional listings.
                  </span>
                </div>
              )}

              {/* 3-Column Price Distribution */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium block">Market Floor</span>
                  <span className="text-base sm:text-lg font-bold text-slate-800 font-mono tabular-nums mt-1 block">
                    {priceEstimate.rangeMin !== null
                      ? `${priceEstimate.currency === 'USD' ? '$' : priceEstimate.currency === 'NGN' ? '₦' : `${priceEstimate.currency} `}${priceEstimate.rangeMin.toLocaleString()}`
                      : 'N/A'}
                  </span>
                  <span className="text-[10px] text-slate-400">Competitive floor</span>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100">
                  <span className="text-[11px] text-indigo-700 font-medium block">Representative Median</span>
                  <span className="text-base sm:text-lg font-bold text-indigo-950 font-mono tabular-nums mt-1 block">
                    {priceEstimate.formattedBenchmark}
                  </span>
                  <span className="text-[10px] text-indigo-600/80">Median benchmark</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium block">Market Ceiling</span>
                  <span className="text-base sm:text-lg font-bold text-slate-800 font-mono tabular-nums mt-1 block">
                    {priceEstimate.rangeMax !== null
                      ? `${priceEstimate.currency === 'USD' ? '$' : priceEstimate.currency === 'NGN' ? '₦' : `${priceEstimate.currency} `}${priceEstimate.rangeMax.toLocaleString()}`
                      : 'N/A'}
                  </span>
                  <span className="text-[10px] text-slate-400">Retail / high tier</span>
                </div>
              </div>
            </div>

            {/* Visual Range bar */}
            {priceEstimate.rangeMin !== null && priceEstimate.rangeMax !== null && !isSingleQuote && (
              <div className="mt-5">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-slate-300 w-1/4 h-full" />
                  <div className="bg-indigo-600 w-2/4 h-full" />
                  <div className="bg-slate-300 w-1/4 h-full" />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>Min {priceEstimate.rangeMin.toLocaleString()}</span>
                  <span className="text-indigo-700 font-medium font-sans">Empirical Spread</span>
                  <span>Max {priceEstimate.rangeMax.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* NO-PRICE STATE */
        <section className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-left">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Price Currently Unavailable Online
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                No verified public price quotes were discovered across retailer or distributor catalogs for this item. 
                Suppliers may require direct requests for quotation (RFQ), trade registration, or formal commercial invoicing.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Product specifications and known vendor channels remain documented below.</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. SPECIFICATIONS & VARIANTS SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specifications Table (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Tag className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">
              Technical Specifications & Properties
            </h3>
          </div>

          {specifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {specifications.map((spec) => (
                <div key={spec.label} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1 sm:gap-4">
                  <span className="text-slate-500 font-medium sm:w-1/3 shrink-0">
                    {spec.label}
                  </span>
                  <span className="text-slate-900 font-normal sm:w-2/3 text-left">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-4">
              No detailed numerical specifications recorded in current catalog records.
            </p>
          )}
        </div>

        {/* Possible Brands or Variants (1 col) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                Known Brands & Commercial Variants
              </h3>
            </div>

            {brandsOrVariants.length > 0 ? (
              <ul className="space-y-2.5 text-xs">
                {brandsOrVariants.map((variant) => (
                  <li key={variant} className="flex items-start gap-2 text-slate-700">
                    <span className="text-slate-300 mt-0.5">•</span>
                    <span>{variant}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No specific commercial brand variants recorded.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Pricing varies substantially between proprietary formulations and generic equivalents.
          </div>
        </div>
      </section>

      {/* 4. SOURCE PRICES & CITATIONS SECTION */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Source Prices & Vendor Observations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific seller listings and catalog entries used to synthesize market intelligence.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {hasObservations ? observations.length : result.sourceQuotes.length} quotes retrieved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium">
                <th className="py-2.5 pr-4">Product / Source Title</th>
                <th className="py-2.5 px-4">Seller / Site</th>
                <th className="py-2.5 px-4">Listed Price</th>
                <th className="py-2.5 px-4">Currency</th>
                <th className="py-2.5 px-4">Match Category</th>
                <th className="py-2.5 pl-4 text-right">Source Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hasObservations
                ? observations.map((obs, idx) => (
                    <tr key={idx} className={obs.isOutlier ? 'bg-amber-50/40 text-slate-500' : 'hover:bg-slate-50/80'}>
                      <td className="py-3 pr-4 font-medium text-slate-900 max-w-xs">
                        <div className="truncate">{obs.productTitle}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {obs.seller || obs.source}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                        {obs.originalCurrency === 'USD' ? '$' : obs.originalCurrency === 'NGN' ? '₦' : `${obs.originalCurrency} `}
                        {obs.originalPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {obs.originalCurrency}
                      </td>
                      <td className="py-3 px-4">
                        {obs.isOutlier ? (
                          <span className="text-[11px] font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                            Outlier Excluded
                          </span>
                        ) : obs.isExactMatch ? (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Exact Match
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            Variant Match
                          </span>
                        )}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <a
                          href={obs.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded"
                        >
                          <span>Visit Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))
                : result.sourceQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pr-4 font-medium text-slate-900 max-w-xs">
                        <div className="truncate">{quote.notes || quote.sellerOrSource}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {quote.sellerOrSource}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                        {quote.formattedPrice}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {quote.currency}
                      </td>
                      <td className="py-3 px-4 text-slate-500 capitalize">
                        {quote.sourceType}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <a
                          href={quote.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded"
                        >
                          <span>Visit Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. IMPORTANT NOTICES, DISCLAIMERS & LIMITATIONS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price-Change Disclaimer & Assumptions */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs">
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-slate-600" />
            <span>Price-Change Disclaimer & Assumptions</span>
          </h4>
          <p className="text-slate-600 leading-relaxed mb-3">
            {disclaimer || 'Prices reflect recent public supplier observations and are subject to real-time market shifts, local taxes, freight, and vendor stock fluctuations.'}
          </p>
          {assumptions.length > 0 && (
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              {assumptions.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Identification Uncertainty & Limitations */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs">
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-600" />
            <span>Identification Uncertainty & Limitations</span>
          </h4>
          {uncertaintyNotes.length > 0 ? (
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              {uncertaintyNotes.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 italic">No significant specification ambiguities detected for this query.</p>
          )}
        </div>
      </section>
    </div>
  );
};
