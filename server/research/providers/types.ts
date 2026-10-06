import { ProductQueryInterpretation } from '../../../src/types/queryUnderstanding';
import { ProductResearchRecord } from '../../../src/types/productResearch';

/**
 * Pluggable provider interface for live web search and product data extraction.
 * Enables swapping search backends (Gemini Google Search Grounding, Serper, SerpAPI, custom crawlers)
 * without modifying domain logic or user interfaces.
 */
export interface WebResearchProvider {
  readonly id: string;
  readonly name: string;
  research(interpretation: ProductQueryInterpretation): Promise<ProductResearchRecord[]>;
}
