export type PricingConfidence = 'low' | 'medium' | 'high';

export interface PriceObservation {
  source: string;
  sourceUrl: string;
  seller: string | null;
  productTitle: string;
  originalPrice: number;
  originalCurrency: string;
  normalizedPrice: number;
  normalizedCurrency: string;
  isExactMatch: boolean;
  matchScore: number;
  isOutlier: boolean;
  notes?: string;
}

export interface PricingIntelligenceResult {
  currency: string;
  minPrice: number | null;
  maxPrice: number | null;
  estimatedPrice: number | null;
  confidence: PricingConfidence;
  priceObservations: PriceObservation[];
  methodology: string;
  limitations: string[];
}
