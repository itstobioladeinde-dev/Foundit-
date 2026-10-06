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
  benchmarkPrice: number;
  currency: string;
  formattedBenchmark: string;
  rangeMin: number;
  rangeMax: number;
  formattedRange: string;
  unitOfMeasure: string;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  quoteCount: number;
}

export interface MarketResearchResult {
  query: string;
  productName: string;
  category: string;
  description: string;
  specifications: ProductSpecification[];
  brandsOrVariants: string[];
  priceEstimate: PriceEstimate;
  sourceQuotes: SourcePriceQuote[];
  assumptions: string[];
  uncertaintyNotes: string[];
  researchedAt: string;
  isMockData?: boolean;
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
