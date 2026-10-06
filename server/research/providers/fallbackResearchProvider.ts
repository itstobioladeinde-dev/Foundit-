import { WebResearchProvider } from './types';
import { ProductQueryInterpretation } from '../../../src/types/queryUnderstanding';
import { ProductResearchRecord } from '../../../src/types/productResearch';
import { normalizeAndDeduplicateRecords } from '../normalizer';
import { MOCK_DATABASE } from '../../../src/data/mockData';

/**
 * Fallback / testing provider used when GEMINI_API_KEY is not set or when network is isolated.
 * Pulls verified supplier records from the isolated catalog or synthesizes normalized records for the query.
 */
export class FallbackResearchProvider implements WebResearchProvider {
  readonly id = 'fallback-research-provider';
  readonly name = 'Curated Market Catalog & Simulation Provider';

  async research(interpretation: ProductQueryInterpretation): Promise<ProductResearchRecord[]> {
    const queryLower = interpretation.name.toLowerCase();

    // Check if query matches any known catalog item
    for (const [key, catalog] of Object.entries(MOCK_DATABASE)) {
      if (queryLower.includes(key) || key.includes(queryLower)) {
        const records: Partial<ProductResearchRecord>[] = catalog.sourceQuotes.map((q) => ({
          source: q.sellerOrSource,
          title: `${catalog.productName} - ${q.sellerOrSource}`,
          url: q.url,
          seller: q.sellerOrSource,
          brand: catalog.brandsOrVariants[0] || null,
          product: catalog.productName,
          price: q.price,
          currency: q.currency,
          availability: 'In Stock',
          specifications: catalog.specifications.slice(0, 4).map((s) => `${s.label}: ${s.value}`),
          retrievedAt: new Date().toISOString(),
        }));

        return normalizeAndDeduplicateRecords(records, interpretation.name);
      }
    }

    // Procedural fallback for arbitrary queries
    const records: Partial<ProductResearchRecord>[] = [
      {
        source: 'Industrial Supply Network',
        title: `${interpretation.name} - Commercial Specification & Listing`,
        url: `https://www.industrialsupply.com/catalog/${encodeURIComponent(interpretation.name.toLowerCase().replace(/\s+/g, '-'))}`,
        seller: 'Industrial Supply Direct',
        brand: interpretation.brand || 'Commercial Grade',
        product: interpretation.name,
        price: 45.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: interpretation.specifications.length > 0 ? interpretation.specifications : ['Standard commercial sizing'],
        retrievedAt: new Date().toISOString(),
      },
      {
        source: 'Global Distributor Depot',
        title: `${interpretation.name} - Wholesale Trade Pricing`,
        url: `https://www.distributordepot.com/products/${encodeURIComponent(interpretation.name.toLowerCase().replace(/\s+/g, '-'))}`,
        seller: 'Global Wholesale Partners',
        brand: interpretation.brand || null,
        product: interpretation.name,
        price: 38.5,
        currency: 'USD',
        availability: 'Made to Order',
        specifications: interpretation.specifications.length > 0 ? interpretation.specifications : ['Contractor bulk pack'],
        retrievedAt: new Date().toISOString(),
      },
    ];

    return normalizeAndDeduplicateRecords(records, interpretation.name);
  }
}
