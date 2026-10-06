import { ProductQueryInterpretation } from './queryUnderstanding';
import { ProductResearchRecord } from './productResearch';
import { PricingIntelligenceResult } from './pricingIntelligence';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ProductSpecification {
  label: string;
  value: string;
  notes?: string;
}

export interface SourcePriceQuote {
  id: string;
  sellerOrSource: string;
  sourceType: 'distributor' | 'retailer' | 'marketplace' | 'manufacturer';
  price: number;
  currency: string;
  formattedPrice: string;
  unit: string;
  url: string;
  dateObserved: string;
  notes?: string;
}

export interface PriceEstimate {
  benchmarkPrice: number | null;
  currency: string;
  formattedBenchmark: string;
  rangeMin: number | null;
  rangeMax: number | null;
  formattedRange: string;
  unitOfMeasure: string;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  quoteCount: number;
  isPriceAvailable?: boolean;
}

export interface MarketResearchResult {
  query: string;
  productName: string;
  category: string;
  description: string;
  brand?: string | null;
  model?: string | null;
  specifications: ProductSpecification[];
  brandsOrVariants: string[];
  priceEstimate: PriceEstimate;
  sourceQuotes: SourcePriceQuote[];
  assumptions: string[];
  uncertaintyNotes: string[];
  disclaimer?: string;
  researchedAt: string;
  isMockData?: boolean;
  interpretation?: ProductQueryInterpretation;
  researchRecords?: ProductResearchRecord[];
  pricingIntelligence?: PricingIntelligenceResult;
  searchId?: string;
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
