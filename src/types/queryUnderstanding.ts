export interface ProductQueryInterpretation {
  name: string;
  category: string;
  description: string;
  brand: string | null;
  model: string | null;
  material: string | null;
  specifications: string[];
  possible_variants: string[];
  search_queries: string[];
  confidence: number;
  uncertainties: string[];
}

export interface UnderstandQueryApiResponse {
  success: boolean;
  data?: ProductQueryInterpretation;
  error?: string;
}
