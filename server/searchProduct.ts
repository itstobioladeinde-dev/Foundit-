import { MarketResearchResult } from '../src/types/market';
import { MarketSearchProvider } from './providers/types';
import { MockSearchProvider } from './providers/mockProvider';
import { understandProductQuery } from './services/queryUnderstandingService.ts';
import { researchProduct } from './research/researchProduct.ts';
import { estimateMarketPrice } from './pricing/pricingEngine.ts';
import { db } from './db/database.ts';

export class SearchValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'SearchValidationError';
    this.statusCode = statusCode;
  }
}

export const MAX_QUERY_LENGTH = 200;

// Provider registry - configurable for future AI engines
let activeProvider: MarketSearchProvider = new MockSearchProvider();

export function setMarketSearchProvider(provider: MarketSearchProvider): void {
  activeProvider = provider;
}

export function getActiveMarketSearchProvider(): MarketSearchProvider {
  return activeProvider;
}

/**
 * Backend abstraction for physical product & material search.
 * Validates input, applies constraints, and queries the configured market provider.
 *
 * @param rawQuery The unvalidated raw query string from the client
 * @returns Market research result payload
 */
export async function searchProduct(rawQuery: unknown): Promise<MarketResearchResult> {
  // 1. Type validation
  if (typeof rawQuery !== 'string') {
    throw new SearchValidationError('Search query must be a valid text string.', 400);
  }

  // 2. Trim unnecessary whitespace
  const trimmed = rawQuery.trim();

  // 3. Validate non-empty
  if (trimmed.length === 0) {
    throw new SearchValidationError('Search query cannot be empty. Please enter an item or material name.', 400);
  }

  // 4. Maximum query length constraint
  if (trimmed.length > MAX_QUERY_LENGTH) {
    throw new SearchValidationError(
      `Search query exceeds maximum length of ${MAX_QUERY_LENGTH} characters (received ${trimmed.length}).`,
      400
    );
  }

  // 5. Sanitize invisible/control characters while preserving unicode and punctuation
  const sanitized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  if (!sanitized) {
    throw new SearchValidationError('Search query contained only invalid control characters.', 400);
  }

  // Cost Control & Fast Cache: If identical query completed within last 30 minutes, reuse cached result
  const CACHE_TTL_MS = 30 * 60 * 1000;
  const recentCached = db.findSearchesByQuery(sanitized);
  const validCached = recentCached.find((c) => {
    if (c.search.status === 'completed' && c.finalResult) {
      const age = Date.now() - new Date(c.search.created_at).getTime();
      return age < CACHE_TTL_MS;
    }
    return false;
  });

  if (validCached && validCached.finalResult) {
    const sym =
      validCached.finalResult.currency === 'USD'
        ? '$'
        : validCached.finalResult.currency === 'NGN'
        ? '₦'
        : `${validCached.finalResult.currency} `;

    return {
      searchId: validCached.search.id,
      query: validCached.search.original_query,
      productName: validCached.finalResult.product_name,
      category: validCached.finalResult.category,
      description: validCached.finalResult.description,
      brand: validCached.finalResult.brand,
      model: validCached.finalResult.model,
      specifications:
        validCached.interpretation?.specifications?.map((s) => ({
          label: 'Specification',
          value: s,
        })) || [],
      brandsOrVariants: validCached.interpretation?.possible_variants || [],
      priceEstimate: {
        benchmarkPrice: validCached.finalResult.benchmark_price,
        currency: validCached.finalResult.currency,
        formattedBenchmark:
          validCached.finalResult.benchmark_price !== null
            ? `${sym}${validCached.finalResult.benchmark_price.toLocaleString()}`
            : 'Price Unavailable',
        rangeMin: validCached.finalResult.range_min,
        rangeMax: validCached.finalResult.range_max,
        formattedRange:
          validCached.finalResult.range_min !== null && validCached.finalResult.range_max !== null
            ? `${sym}${validCached.finalResult.range_min.toLocaleString()} – ${sym}${validCached.finalResult.range_max.toLocaleString()}`
            : 'No Verified Quotes',
        unitOfMeasure: validCached.finalResult.unit_of_measure,
        confidence: validCached.finalResult.confidence,
        confidenceReason: `${validCached.finalResult.methodology} (Served from verified market cache)`,
        quoteCount: validCached.finalResult.quote_count,
        isPriceAvailable: validCached.finalResult.benchmark_price !== null,
      },
      sourceQuotes: validCached.sources.map((s, idx) => ({
        id: `cache-${idx}`,
        sellerOrSource: s.seller || s.source,
        sourceType: 'retailer' as const,
        price: s.price || 0,
        currency: s.currency || validCached.finalResult?.currency || 'USD',
        formattedPrice: s.price !== null ? `${sym}${s.price.toLocaleString()}` : 'Unlisted',
        unit: 'per unit',
        url: s.url,
        dateObserved: s.retrieved_at,
        notes: s.title,
      })),
      assumptions: ['Served from recent verified search intelligence cache.'],
      uncertaintyNotes: validCached.finalResult.limitations,
      disclaimer: validCached.finalResult.disclaimer,
      researchedAt: validCached.search.created_at,
      interpretation: validCached.interpretation
        ? {
            name: validCached.interpretation.name,
            category: validCached.interpretation.category,
            description: validCached.interpretation.description,
            brand: validCached.interpretation.brand,
            model: validCached.interpretation.model,
            material: validCached.interpretation.material,
            specifications: validCached.interpretation.specifications,
            possible_variants: validCached.interpretation.possible_variants,
            search_queries: validCached.interpretation.search_queries,
            confidence: validCached.interpretation.confidence,
            uncertainties: validCached.interpretation.uncertainties,
          }
        : undefined,
      researchRecords: validCached.sources.map((s) => ({
        source: s.source,
        title: s.title,
        url: s.url,
        seller: s.seller,
        brand: s.brand,
        product: s.product,
        price: s.price,
        currency: s.currency,
        availability: s.availability,
        specifications: s.specifications,
        retrievedAt: s.retrieved_at,
      })),
    };
  }

  // 6. Initialize Search Parent Record in Database
  const searchRecord = db.createSearch(sanitized, 'pending');

  // 7. Execute AI Query Understanding Layer
  let interpretation;
  try {
    interpretation = await understandProductQuery(sanitized);
    if (interpretation) {
      db.saveQueryInterpretation(searchRecord.id, interpretation);
    }
  } catch (err: unknown) {
    console.warn('[MarketProbe] Query understanding notice:', err);
  }

  // 8. Execute Product Web Research Layer
  let researchResultSet;
  if (interpretation) {
    try {
      researchResultSet = await researchProduct(interpretation);
      if (researchResultSet?.records && researchResultSet.records.length > 0) {
        db.saveResearchSources(searchRecord.id, researchResultSet.records);
      }
    } catch (err: unknown) {
      console.warn('[MarketProbe] Web research notice:', err);
    }
  }

  // 9. Execute Pricing Intelligence Layer
  let pricingIntelligence;
  if (interpretation && researchResultSet?.records) {
    try {
      pricingIntelligence = estimateMarketPrice(researchResultSet.records, interpretation);
      if (pricingIntelligence?.priceObservations && pricingIntelligence.priceObservations.length > 0) {
        db.savePriceObservations(searchRecord.id, pricingIntelligence);
      }
    } catch (err: unknown) {
      console.warn('[MarketProbe] Pricing intelligence notice:', err);
    }
  }

  // 10. Execute search via provider abstraction
  try {
    const searchResult = await activeProvider.search(sanitized);

    // Apply interpreted taxonomy
    if (interpretation) {
      searchResult.interpretation = interpretation;
      searchResult.productName = interpretation.name;
      searchResult.category = interpretation.category;
      searchResult.description = interpretation.description;
      searchResult.brand = interpretation.brand;
      searchResult.model = interpretation.model;
      if (interpretation.possible_variants.length > 0) {
        searchResult.brandsOrVariants = interpretation.possible_variants;
      }
    }

    if (researchResultSet?.records && researchResultSet.records.length > 0) {
      searchResult.researchRecords = researchResultSet.records;
    }

    searchResult.disclaimer =
      'Prices reflect recent public supplier observations and are subject to real-time market shifts, local taxes, freight, and vendor stock fluctuations.';

    if (pricingIntelligence) {
      searchResult.pricingIntelligence = pricingIntelligence;

      if (pricingIntelligence.estimatedPrice !== null) {
        searchResult.priceEstimate.isPriceAvailable = true;
        searchResult.priceEstimate.benchmarkPrice = pricingIntelligence.estimatedPrice;
        searchResult.priceEstimate.currency = pricingIntelligence.currency;
        const sym =
          pricingIntelligence.currency === 'USD'
            ? '$'
            : pricingIntelligence.currency === 'NGN'
            ? '₦'
            : `${pricingIntelligence.currency} `;
        searchResult.priceEstimate.formattedBenchmark = `${sym}${pricingIntelligence.estimatedPrice.toLocaleString()}`;
        if (pricingIntelligence.minPrice !== null && pricingIntelligence.maxPrice !== null) {
          searchResult.priceEstimate.rangeMin = pricingIntelligence.minPrice;
          searchResult.priceEstimate.rangeMax = pricingIntelligence.maxPrice;
          searchResult.priceEstimate.formattedRange = `${sym}${pricingIntelligence.minPrice.toLocaleString()} – ${sym}${pricingIntelligence.maxPrice.toLocaleString()}`;
        }
        searchResult.priceEstimate.confidence = pricingIntelligence.confidence;
        searchResult.priceEstimate.confidenceReason = pricingIntelligence.methodology;
        searchResult.priceEstimate.quoteCount = pricingIntelligence.priceObservations.filter((o) => !o.isOutlier).length;
      } else {
        // No-price state
        searchResult.priceEstimate.isPriceAvailable = false;
        searchResult.priceEstimate.benchmarkPrice = null;
        searchResult.priceEstimate.rangeMin = null;
        searchResult.priceEstimate.rangeMax = null;
        searchResult.priceEstimate.formattedBenchmark = 'Price Unavailable';
        searchResult.priceEstimate.formattedRange = 'No Verified Quotes';
        searchResult.priceEstimate.confidence = 'low';
        searchResult.priceEstimate.confidenceReason = pricingIntelligence.methodology;
        searchResult.priceEstimate.quoteCount = 0;
      }

      if (pricingIntelligence.limitations.length > 0) {
        searchResult.uncertaintyNotes = [
          ...searchResult.uncertaintyNotes,
          ...pricingIntelligence.limitations,
        ];
      }
    }

    // Attach search ID and persist final result to database
    searchResult.searchId = searchRecord.id;
    db.saveFinalResult(searchRecord.id, searchResult);

    return searchResult;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Provider search failed.';
    db.updateSearchStatus(searchRecord.id, 'failed', message);
    throw new SearchValidationError(`Market search service error: ${message}`, 500);
  }
}
