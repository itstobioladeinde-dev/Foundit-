import React from 'react';
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
} from 'lucide-react';

interface MarketResultDashboardProps {
  result: MarketResearchResult;
  onNewSearch: () => void;
}

const renderConfidenceBadge = (confidence: ConfidenceLevel, reason: string) => {
  if (confidence === 'high') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-700">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-medium">High Confidence</span>
        <span className="text-slate-400">·</span>
        <span className="text-slate-600">{reason}</span>
      </div>
    );
  }
  if (confidence === 'medium') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-700">
        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-medium">Moderate Confidence</span>
        <span className="text-slate-400">·</span>
        <span className="text-slate-600">{reason}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-xs text-rose-700">
      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
      <span className="font-medium">Low Confidence</span>
      <span className="text-slate-400">·</span>
      <span className="text-slate-600">{reason}</span>
    </div>
  );
};

export const MarketResultDashboard: React.FC<MarketResultDashboardProps> = ({
  result,
  onNewSearch,
}) => {
  const { priceEstimate, specifications, sourceQuotes, brandsOrVariants, assumptions, uncertaintyNotes } = result;

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 text-left space-y-6">
      {/* Mock Data Prototype Alert */}
      {result.isMockData && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold">Prototype Mode Notice: </strong>
            This response is currently rendered using isolated mock data to test the user interface. 
            No live web queries or fake API claims are active until backend integration.
          </div>
        </div>
      )}

      {/* Main Product Header */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mb-1.5">
              <span>{result.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{result.researchedAt}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {result.productName}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
              {result.description}
            </p>
          </div>

          <button
            onClick={onNewSearch}
            className="self-start text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none shrink-0"
          >
            Search Another Item
          </button>
        </div>

        {/* Confidence Row */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          {renderConfidenceBadge(priceEstimate.confidence, priceEstimate.confidenceReason)}
        </div>
      </div>

      {/* AI Query-Understanding & Research Strategy Card */}
      {result.interpretation && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                  AI Query-Understanding & Search Strategy
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded">
                  Validated Schema
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured query interpretation feeding the downstream web research layer.
              </p>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>Interpretation Confidence:</span>
              <span className="font-semibold text-slate-900 font-mono">
                {Math.round(result.interpretation.confidence * 100)}%
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-medium block">Interpreted Name</span>
              <span className="font-semibold text-slate-900 mt-1 block">
                {result.interpretation.name}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-medium block">Category</span>
              <span className="font-semibold text-slate-900 mt-1 block">
                {result.interpretation.category}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-medium block">Brand & Model</span>
              <span className="font-semibold text-slate-900 mt-1 block">
                {result.interpretation.brand
                  ? `${result.interpretation.brand}${result.interpretation.model ? ` (${result.interpretation.model})` : ''}`
                  : 'Unspecified'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-medium block">Primary Material</span>
              <span className="font-semibold text-slate-900 mt-1 block capitalize">
                {result.interpretation.material || 'Generic / Composite'}
              </span>
            </div>
          </div>

          {/* Extracted Specifications & Generated Search Queries */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Extracted Specs from query */}
            <div className="p-4 bg-slate-50/70 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-2">
                Explicit Specifications Extracted:
              </span>
              {result.interpretation.specifications.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {result.interpretation.specifications.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 font-medium rounded text-[11px]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">No explicit dimensions or standards specified.</span>
              )}
            </div>

            {/* Generated Search Queries */}
            <div className="p-4 bg-slate-50/70 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-2">
                Generated Research Queries:
              </span>
              <ul className="space-y-1 text-slate-700 font-mono text-[11px]">
                {result.interpretation.search_queries.map((sq, i) => (
                  <li key={i} className="flex items-center gap-1.5 truncate">
                    <span className="text-indigo-600 font-bold shrink-0">›</span>
                    <span className="truncate">{sq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Uncertainties if any */}
          {result.interpretation.uncertainties.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-amber-800">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium mr-1.5">Acknowledged Ambiguities:</span>
                <span>{result.interpretation.uncertainties.join(' · ')}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Normalized Web Research Evidence Layer */}
      {result.researchRecords && result.researchRecords.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                  Normalized Web Research Records ({result.researchRecords.length})
                </span>
                <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded">
                  Untrusted Web Isolation Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured seller listings and distributor pages extracted by the research layer.
              </p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {result.researchRecords.map((rec, i) => (
              <div key={i} className="py-3.5 first:pt-1 last:pb-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-medium text-slate-900">{rec.source}</span>
                      {rec.seller && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Seller: {rec.seller}</span>
                        </>
                      )}
                      {rec.brand && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Brand: {rec.brand}</span>
                        </>
                      )}
                      {rec.availability && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700">{rec.availability}</span>
                        </>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {rec.title}
                    </h4>

                    {rec.specifications.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {rec.specifications.map((s, si) => (
                          <span
                            key={si}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right shrink-0 mt-2 sm:mt-0 flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2">
                    <div>
                      {rec.price !== null ? (
                        <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                          {rec.currency === 'USD' ? '$' : rec.currency === 'NGN' ? '₦' : `${rec.currency} `}
                          {rec.price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Price unlisted</span>
                      )}
                    </div>

                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                    >
                      <span>Source Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Intelligence Engine Audit & Observation Breakdown */}
      {result.pricingIntelligence && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                  Pricing Intelligence Engine Audit
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded">
                  Empirical Quotes Only
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {result.pricingIntelligence.methodology}
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Target Currency: <strong className="font-mono text-slate-900">{result.pricingIntelligence.currency}</strong>
            </div>
          </div>

          {/* Observations Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-medium">
                  <th className="py-2.5 pr-4">Merchant / Source</th>
                  <th className="py-2.5 px-4">Original Source Quote</th>
                  <th className="py-2.5 px-4">Normalized Benchmark Quote</th>
                  <th className="py-2.5 px-4">Match Category</th>
                  <th className="py-2.5 pl-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.pricingIntelligence.priceObservations.map((obs, idx) => (
                  <tr key={idx} className={obs.isOutlier ? 'bg-amber-50/40 text-slate-500' : 'hover:bg-slate-50/80'}>
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      <div>{obs.source}</div>
                      <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">{obs.productTitle}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800 tabular-nums">
                      {obs.originalCurrency === 'USD' ? '$' : obs.originalCurrency === 'NGN' ? '₦' : `${obs.originalCurrency} `}
                      {obs.originalPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                      {obs.normalizedCurrency === 'USD' ? '$' : obs.normalizedCurrency === 'NGN' ? '₦' : `${obs.normalizedCurrency} `}
                      {obs.normalizedPrice.toLocaleString()}
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
                          Related Variant
                        </span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <a
                        href={obs.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                      >
                        <span>Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Engine Limitations & Footnotes */}
          {result.pricingIntelligence.limitations.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-800 block mb-1">Pricing Integrity & Limitation Notes:</span>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {result.pricingIntelligence.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Pricing Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Benchmark Card */}
        <div className="p-6 bg-slate-900 text-white rounded-xl shadow-xs md:col-span-1 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
              Estimated Current Benchmark
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight font-mono tabular-nums text-white">
                {priceEstimate.formattedBenchmark}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {priceEstimate.currency}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-300">
              Unit: <span className="text-white font-medium">{priceEstimate.unitOfMeasure}</span>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            Based on <span className="text-slate-200 font-semibold">{priceEstimate.quoteCount}</span> verified source prices.
            Always review the range below.
          </div>
        </div>

        {/* Range Spread Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-2xs md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Observed Market Price Range
              </span>
              <span className="text-xs text-slate-500">
                Unit: {priceEstimate.unitOfMeasure}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Low Range</span>
                <span className="text-lg sm:text-xl font-bold text-slate-800 font-mono tabular-nums mt-1 block">
                  ${priceEstimate.rangeMin.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400">Bulk / contractor floor</span>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100">
                <span className="text-[11px] text-indigo-700 font-medium block">Benchmark Median</span>
                <span className="text-lg sm:text-xl font-bold text-indigo-950 font-mono tabular-nums mt-1 block">
                  {priceEstimate.formattedBenchmark}
                </span>
                <span className="text-[10px] text-indigo-600/80">Average prevailing</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">High Range</span>
                <span className="text-lg sm:text-xl font-bold text-slate-800 font-mono tabular-nums mt-1 block">
                  ${priceEstimate.rangeMax.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400">Premium / retail ceiling</span>
              </div>
            </div>
          </div>

          {/* Visual Range bar */}
          <div className="mt-6">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-slate-300 w-1/4 h-full" />
              <div className="bg-indigo-600 w-2/4 h-full" />
              <div className="bg-slate-300 w-1/4 h-full" />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
              <span>Min ${priceEstimate.rangeMin.toFixed(2)}</span>
              <span className="text-indigo-700 font-medium">Standard Market Band</span>
              <span>Max ${priceEstimate.rangeMax.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Variants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specifications Table (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Tag className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">
              Technical Specifications & Dimensions
            </h3>
          </div>

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
        </div>

        {/* Possible Brands or Variants (1 col) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                Known Brands & Product Variants
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs">
              {brandsOrVariants.map((variant) => (
                <li key={variant} className="flex items-start gap-2 text-slate-700">
                  <span className="text-slate-300 mt-0.5">•</span>
                  <span>{variant}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Prices vary significantly across proprietary alloy grades, brand reputations, and warranties.
          </div>
        </div>
      </div>

      {/* Source Quotes Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Verified Source Prices & Citations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific seller observations used to calculate benchmark pricing.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {sourceQuotes.length} quotes recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium">
                <th className="py-2.5 pr-4">Seller / Merchant</th>
                <th className="py-2.5 px-4">Channel</th>
                <th className="py-2.5 px-4">Observed Price</th>
                <th className="py-2.5 px-4">Unit / Variant Notes</th>
                <th className="py-2.5 pl-4 text-right">Source Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sourceQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {quote.sellerOrSource}
                  </td>
                  <td className="py-3 px-4 text-slate-500 capitalize">
                    {quote.sourceType}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                    {quote.formattedPrice}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span>{quote.notes || quote.unit}</span>
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <a
                      href={quote.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumptions & Uncertainty Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Assumptions */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs">
          <h4 className="font-semibold text-slate-900 mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-slate-600" />
            <span>Pricing Assumptions</span>
          </h4>
          <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
            {assumptions.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Uncertainty & Market Volatility */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs">
          <h4 className="font-semibold text-slate-900 mb-2.5 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-600" />
            <span>Uncertainty & Market Volatility</span>
          </h4>
          <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
            {uncertaintyNotes.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
