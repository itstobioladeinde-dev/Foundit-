export interface ProductResearchRecord {
  source: string;
  title: string;
  url: string;
  seller: string | null;
  brand: string | null;
  product: string;
  price: number | null;
  currency: string | null;
  availability: string | null;
  specifications: string[];
  retrievedAt: string;
}

export interface ProductResearchResultSet {
  query: string;
  records: ProductResearchRecord[];
  totalFound: number;
  searchQueriesUsed: string[];
  retrievedAt: string;
  providerId: string;
  warnings?: string[];
}
