import { ProductQueryInterpretation } from '../../src/types/queryUnderstanding';
import { ProductResearchRecord, ProductResearchResultSet } from '../../src/types/productResearch';
import { WebResearchProvider } from './providers/types';
import { GeminiSearchProvider } from './providers/geminiSearchProvider';
import { FallbackResearchProvider } from './providers/fallbackResearchProvider';

function initializeDefaultProvider(): WebResearchProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    return new GeminiSearchProvider(apiKey);
  }
  return new FallbackResearchProvider();
}

let activeResearchProvider: WebResearchProvider = initializeDefaultProvider();

export function setWebResearchProvider(provider: WebResearchProvider): void {
  activeResearchProvider = provider;
}

export function getActiveWebResearchProvider(): WebResearchProvider {
  return activeResearchProvider;
}

/**
 * Service abstraction: researchProduct(interpretation)
 * Executes web research for an interpreted product query, extracting specs, prices, and source URLs.
 */
export async function researchProduct(
  interpretation: ProductQueryInterpretation
): Promise<ProductResearchResultSet> {
  const warnings: string[] = [];

  if (!interpretation || !interpretation.name) {
    throw new Error('Valid product interpretation is required for research.');
  }

  // Ensure active provider is synced if GEMINI_API_KEY became available at runtime
  if (
    activeResearchProvider.id === 'fallback-research-provider' &&
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
  ) {
    activeResearchProvider = new GeminiSearchProvider(process.env.GEMINI_API_KEY);
  }

  let records: ProductResearchRecord[] = [];

  try {
    records = await activeResearchProvider.research(interpretation);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Search provider failure';
    warnings.push(`Search provider encounter error: ${errorMsg}. Falling back to standard catalog.`);

    // Fallback on search failure
    const fallback = new FallbackResearchProvider();
    try {
      records = await fallback.research(interpretation);
    } catch {
      records = [];
    }
  }

  // Handle No Results condition
  if (records.length === 0) {
    warnings.push('No direct online merchant quotes or product pages matched the query.');
  }

  // Check for missing prices in records
  const recordsWithPrice = records.filter((r) => r.price !== null);
  if (records.length > 0 && recordsWithPrice.length === 0) {
    warnings.push('Collected supplier pages, but explicit numeric prices were not publicly listed.');
  }

  return {
    query: interpretation.name,
    records,
    totalFound: records.length,
    searchQueriesUsed: interpretation.search_queries,
    retrievedAt: new Date().toISOString(),
    providerId: activeResearchProvider.id,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
