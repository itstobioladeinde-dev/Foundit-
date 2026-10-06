import { MarketSearchProvider } from './types';
import { MarketResearchResult } from '../../src/types/market';
import { getMockResearchResult } from '../../src/data/mockData';

/**
 * Isolated preview provider returning structured market data for the requested query.
 * In the next stage, this provider is complemented or replaced by a live Google Search Grounding provider.
 */
export class MockSearchProvider implements MarketSearchProvider {
  readonly id = 'preview-mock-provider';
  readonly name = 'MarketProbe Preview Prototype Provider';

  async search(query: string): Promise<MarketResearchResult> {
    // Simulate brief network I/O
    await new Promise((resolve) => setTimeout(resolve, 250));
    return getMockResearchResult(query);
  }
}
