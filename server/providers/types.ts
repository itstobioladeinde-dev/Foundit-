import { MarketResearchResult } from '../../src/types/market';

/**
 * Pluggable provider interface for market research and product spec extraction.
 * Enables changing or augmenting the AI search engine (e.g., Gemini, custom scrapers, or fallbacks)
 * without modifying backend endpoints or client-side contracts.
 */
export interface MarketSearchProvider {
  readonly id: string;
  readonly name: string;
  search(query: string): Promise<MarketResearchResult>;
}
