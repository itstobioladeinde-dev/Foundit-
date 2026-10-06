import { MarketResearchResult } from '../src/types/market';
import { MarketSearchProvider } from './providers/types';
import { MockSearchProvider } from './providers/mockProvider';
import { understandProductQuery } from './services/queryUnderstandingService.ts';
import { researchProduct } from './research/researchProduct.ts';
import { estimateMarketPrice } from './pricing/pricingEngine.ts';

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

  // 6. Execute AI Query Understanding Layer
  let interpretation;
  try {
    interpretation = await understandProductQuery(sanitized);
  } catch (err: unknown) {
    console.warn('[MarketProbe] Query understanding notice:', err);
  }

  // 7. Execute Product Web Research Layer
  let researchResultSet;
  if (interpretation) {
    try {
      researchResultSet = await researchProduct(interpretation);
    } catch (err: unknown) {
      console.warn('[MarketProbe] Web research notice:', err);
    }
  }

  // 8. Execute Pricing Intelligence Layer
  let pricingIntelligence;
  if (interpretation && researchResultSet?.records) {
    try {
      pricingIntelligence = estimateMarketPrice(researchResultSet.records, interpretation);
    } catch (err: unknown) {
      console.warn('[MarketProbe] Pricing intelligence notice:', err);
    }
  }

  // 9. Execute search via provider abstraction
  try {
    const searchResult = await activeProvider.search(sanitized);
    if (interpretation) {
      searchResult.interpretation = interpretation;
    }
    if (researchResultSet?.records && researchResultSet.records.length > 0) {
      searchResult.researchRecords = researchResultSet.records;
    }
    if (pricingIntelligence) {
      searchResult.pricingIntelligence = pricingIntelligence;
      if (pricingIntelligence.estimatedPrice !== null) {
        searchResult.priceEstimate.benchmarkPrice = pricingIntelligence.estimatedPrice;
        searchResult.priceEstimate.currency = pricingIntelligence.currency;
        const sym = pricingIntelligence.currency === 'USD' ? '$' : pricingIntelligence.currency === 'NGN' ? '₦' : `${pricingIntelligence.currency} `;
        searchResult.priceEstimate.formattedBenchmark = `${sym}${pricingIntelligence.estimatedPrice.toLocaleString()}`;
        if (pricingIntelligence.minPrice !== null && pricingIntelligence.maxPrice !== null) {
          searchResult.priceEstimate.rangeMin = pricingIntelligence.minPrice;
          searchResult.priceEstimate.rangeMax = pricingIntelligence.maxPrice;
          searchResult.priceEstimate.formattedRange = `${sym}${pricingIntelligence.minPrice.toLocaleString()} – ${sym}${pricingIntelligence.maxPrice.toLocaleString()}`;
        }
        searchResult.priceEstimate.confidence = pricingIntelligence.confidence;
        searchResult.priceEstimate.confidenceReason = pricingIntelligence.methodology;
        if (pricingIntelligence.limitations.length > 0) {
          searchResult.uncertaintyNotes = [...searchResult.uncertaintyNotes, ...pricingIntelligence.limitations];
        }
      }
    }
    return searchResult;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Provider search failed.';
    throw new SearchValidationError(`Market search service error: ${message}`, 500);
  }
}
