import { PricingConfidence } from '../../src/types/pricingIntelligence';

export type SearchExecutionStatus = 'pending' | 'completed' | 'failed';

export interface SearchTableRecord {
  id: string; // Primary Key (UUID)
  original_query: string; // User input query
  normalized_query: string; // Lowercased & trimmed for index matching
  status: SearchExecutionStatus;
  error_message?: string;
  created_at: string; // ISO 8601 Timestamp (Indexed)
  updated_at: string;
}

export interface QueryInterpretationTableRecord {
  id: string; // Primary Key (UUID)
  search_id: string; // Foreign Key -> searches.id (Indexed)
  name: string;
  category: string;
  description: string;
  brand: string | null;
  model: string | null;
  material: string | null;
  specifications: string[]; // JSON array
  possible_variants: string[]; // JSON array
  search_queries: string[]; // JSON array
  confidence: number;
  uncertainties: string[]; // JSON array
  created_at: string;
}

export interface ResearchSourceTableRecord {
  id: string; // Primary Key (UUID)
  search_id: string; // Foreign Key -> searches.id (Indexed)
  source: string;
  title: string;
  url: string; // Indexed for deduplication
  seller: string | null;
  brand: string | null;
  product: string;
  price: number | null;
  currency: string | null;
  availability: string | null;
  specifications: string[]; // JSON array
  retrieved_at: string;
}

export interface PriceObservationTableRecord {
  id: string; // Primary Key (UUID)
  search_id: string; // Foreign Key -> searches.id (Indexed)
  source_id?: string; // Optional Foreign Key -> research_sources.id
  source: string;
  source_url: string;
  seller: string | null;
  product_title: string;
  original_price: number;
  original_currency: string;
  normalized_price: number;
  normalized_currency: string;
  is_exact_match: boolean;
  match_score: number;
  is_outlier: boolean;
  notes?: string;
  created_at: string;
}

export interface FinalSearchResultTableRecord {
  id: string; // Primary Key (UUID)
  search_id: string; // Foreign Key -> searches.id (Unique, Indexed)
  product_name: string;
  category: string;
  description: string;
  brand: string | null;
  model: string | null;
  benchmark_price: number | null;
  range_min: number | null;
  range_max: number | null;
  currency: string;
  confidence: PricingConfidence;
  quote_count: number;
  unit_of_measure: string;
  methodology: string;
  limitations: string[]; // JSON array
  disclaimer: string;
  created_at: string;
}

/**
 * Full hydrated relational structure combining:
 * Search
 *  → Query interpretation (1-to-1)
 *  → Research sources (1-to-many)
 *  → Price observations (1-to-many)
 *  → Final result (1-to-1)
 */
export interface SearchWithFullRelations {
  search: SearchTableRecord;
  interpretation?: QueryInterpretationTableRecord;
  sources: ResearchSourceTableRecord[];
  observations: PriceObservationTableRecord[];
  finalResult?: FinalSearchResultTableRecord;
}
