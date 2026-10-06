import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  SearchTableRecord,
  QueryInterpretationTableRecord,
  ResearchSourceTableRecord,
  PriceObservationTableRecord,
  FinalSearchResultTableRecord,
  SearchWithFullRelations,
  SearchExecutionStatus,
} from './schema';
import { ProductQueryInterpretation } from '../../src/types/queryUnderstanding';
import { ProductResearchRecord } from '../../src/types/productResearch';
import { PricingIntelligenceResult } from '../../src/types/pricingIntelligence';
import { MarketResearchResult } from '../../src/types/market';

interface DatabaseSnapshot {
  version: number;
  searches: SearchTableRecord[];
  interpretations: QueryInterpretationTableRecord[];
  sources: ResearchSourceTableRecord[];
  observations: PriceObservationTableRecord[];
  finalResults: FinalSearchResultTableRecord[];
}

export class RelationalMarketDatabase {
  private dbFilePath: string;

  // Primary Key Tables
  private searches = new Map<string, SearchTableRecord>();
  private interpretations = new Map<string, QueryInterpretationTableRecord>();
  private sources = new Map<string, ResearchSourceTableRecord>();
  private observations = new Map<string, PriceObservationTableRecord>();
  private finalResults = new Map<string, FinalSearchResultTableRecord>();

  // Foreign Key & Query Indexes
  private idxSearchByNormalizedQuery = new Map<string, string[]>(); // normalized_query -> search_ids[]
  private idxInterpretationsBySearchId = new Map<string, string>(); // search_id -> interpretation_id
  private idxSourcesBySearchId = new Map<string, string[]>(); // search_id -> source_ids[]
  private idxObservationsBySearchId = new Map<string, string[]>(); // search_id -> observation_ids[]
  private idxFinalResultBySearchId = new Map<string, string>(); // search_id -> final_result_id

  constructor(customDbPath?: string) {
    const dataDir = path.resolve(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbFilePath = customDbPath || path.resolve(dataDir, 'marketprobe_db.json');
    this.loadFromDisk();
  }

  // --- Persistence Methods ---

  private loadFromDisk(): void {
    if (!fs.existsSync(this.dbFilePath)) {
      return;
    }

    try {
      const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
      const data: DatabaseSnapshot = JSON.parse(raw);

      // Populate Searches
      data.searches?.forEach((s) => {
        this.searches.set(s.id, s);
        this.indexSearchQuery(s.id, s.normalized_query);
      });

      // Populate Interpretations
      data.interpretations?.forEach((i) => {
        this.interpretations.set(i.id, i);
        this.idxInterpretationsBySearchId.set(i.search_id, i.id);
      });

      // Populate Sources
      data.sources?.forEach((src) => {
        this.sources.set(src.id, src);
        const list = this.idxSourcesBySearchId.get(src.search_id) || [];
        list.push(src.id);
        this.idxSourcesBySearchId.set(src.search_id, list);
      });

      // Populate Observations
      data.observations?.forEach((obs) => {
        this.observations.set(obs.id, obs);
        const list = this.idxObservationsBySearchId.get(obs.search_id) || [];
        list.push(obs.id);
        this.idxObservationsBySearchId.set(obs.search_id, list);
      });

      // Populate Final Results
      data.finalResults?.forEach((res) => {
        this.finalResults.set(res.id, res);
        this.idxFinalResultBySearchId.set(res.search_id, res.id);
      });
    } catch (err: unknown) {
      console.warn('[MarketProbe DB] Warning loading database snapshot from disk:', err);
    }
  }

  private flushToDisk(): void {
    try {
      const snapshot: DatabaseSnapshot = {
        version: 1,
        searches: Array.from(this.searches.values()),
        interpretations: Array.from(this.interpretations.values()),
        sources: Array.from(this.sources.values()),
        observations: Array.from(this.observations.values()),
        finalResults: Array.from(this.finalResults.values()),
      };

      const tempPath = `${this.dbFilePath}.tmp-${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(snapshot, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.dbFilePath); // Atomic file replace
    } catch (err: unknown) {
      console.error('[MarketProbe DB] Failed to flush database to disk:', err);
    }
  }

  private indexSearchQuery(searchId: string, normalizedQuery: string): void {
    const existing = this.idxSearchByNormalizedQuery.get(normalizedQuery) || [];
    if (!existing.includes(searchId)) {
      existing.push(searchId);
      this.idxSearchByNormalizedQuery.set(normalizedQuery, existing);
    }
  }

  // --- CRUD Operations ---

  /**
   * Creates a new Search parent record.
   */
  public createSearch(originalQuery: string, status: SearchExecutionStatus = 'pending'): SearchTableRecord {
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const normalized = originalQuery.trim().toLowerCase();

    const record: SearchTableRecord = {
      id,
      original_query: originalQuery.trim(),
      normalized_query: normalized,
      status,
      created_at: timestamp,
      updated_at: timestamp,
    };

    this.searches.set(id, record);
    this.indexSearchQuery(id, normalized);
    this.flushToDisk();
    return record;
  }

  /**
   * Updates the execution status of a search record.
   */
  public updateSearchStatus(searchId: string, status: SearchExecutionStatus, errorMessage?: string): void {
    const search = this.searches.get(searchId);
    if (!search) return;

    search.status = status;
    search.updated_at = new Date().toISOString();
    if (errorMessage) {
      search.error_message = errorMessage;
    }
    this.flushToDisk();
  }

  /**
   * Stores the structured Query Interpretation related to a search (1-to-1).
   */
  public saveQueryInterpretation(
    searchId: string,
    interpretation: ProductQueryInterpretation
  ): QueryInterpretationTableRecord {
    if (!this.searches.has(searchId)) {
      throw new Error(`Foreign Key Constraint Violation: Search with id "${searchId}" does not exist.`);
    }

    const id = crypto.randomUUID();
    const record: QueryInterpretationTableRecord = {
      id,
      search_id: searchId,
      name: interpretation.name,
      category: interpretation.category,
      description: interpretation.description,
      brand: interpretation.brand,
      model: interpretation.model,
      material: interpretation.material,
      specifications: interpretation.specifications || [],
      possible_variants: interpretation.possible_variants || [],
      search_queries: interpretation.search_queries || [],
      confidence: interpretation.confidence,
      uncertainties: interpretation.uncertainties || [],
      created_at: new Date().toISOString(),
    };

    this.interpretations.set(id, record);
    this.idxInterpretationsBySearchId.set(searchId, id);
    this.flushToDisk();
    return record;
  }

  /**
   * Stores multiple Research Sources related to a search (1-to-many).
   */
  public saveResearchSources(
    searchId: string,
    records: ProductResearchRecord[]
  ): ResearchSourceTableRecord[] {
    if (!this.searches.has(searchId)) {
      throw new Error(`Foreign Key Constraint Violation: Search with id "${searchId}" does not exist.`);
    }

    const created: ResearchSourceTableRecord[] = [];
    const sourceIds: string[] = this.idxSourcesBySearchId.get(searchId) || [];

    for (const r of records) {
      const id = crypto.randomUUID();
      const record: ResearchSourceTableRecord = {
        id,
        search_id: searchId,
        source: r.source,
        title: r.title,
        url: r.url,
        seller: r.seller,
        brand: r.brand,
        product: r.product,
        price: r.price,
        currency: r.currency,
        availability: r.availability,
        specifications: r.specifications || [],
        retrieved_at: r.retrievedAt || new Date().toISOString(),
      };

      this.sources.set(id, record);
      sourceIds.push(id);
      created.push(record);
    }

    this.idxSourcesBySearchId.set(searchId, sourceIds);
    this.flushToDisk();
    return created;
  }

  /**
   * Stores multiple Price Observations related to a search (1-to-many).
   */
  public savePriceObservations(
    searchId: string,
    pricing: PricingIntelligenceResult
  ): PriceObservationTableRecord[] {
    if (!this.searches.has(searchId)) {
      throw new Error(`Foreign Key Constraint Violation: Search with id "${searchId}" does not exist.`);
    }

    const created: PriceObservationTableRecord[] = [];
    const observationIds: string[] = this.idxObservationsBySearchId.get(searchId) || [];

    for (const obs of pricing.priceObservations) {
      const id = crypto.randomUUID();
      const record: PriceObservationTableRecord = {
        id,
        search_id: searchId,
        source: obs.source,
        source_url: obs.sourceUrl,
        seller: obs.seller,
        product_title: obs.productTitle,
        original_price: obs.originalPrice,
        original_currency: obs.originalCurrency,
        normalized_price: obs.normalizedPrice,
        normalized_currency: obs.normalizedCurrency,
        is_exact_match: obs.isExactMatch,
        match_score: obs.matchScore,
        is_outlier: obs.isOutlier,
        notes: obs.notes,
        created_at: new Date().toISOString(),
      };

      this.observations.set(id, record);
      observationIds.push(id);
      created.push(record);
    }

    this.idxObservationsBySearchId.set(searchId, observationIds);
    this.flushToDisk();
    return created;
  }

  /**
   * Stores the Final Result related to a search (1-to-1).
   */
  public saveFinalResult(
    searchId: string,
    result: MarketResearchResult
  ): FinalSearchResultTableRecord {
    if (!this.searches.has(searchId)) {
      throw new Error(`Foreign Key Constraint Violation: Search with id "${searchId}" does not exist.`);
    }

    const id = crypto.randomUUID();
    const record: FinalSearchResultTableRecord = {
      id,
      search_id: searchId,
      product_name: result.productName,
      category: result.category,
      description: result.description,
      brand: result.brand || null,
      model: result.model || null,
      benchmark_price: result.priceEstimate.benchmarkPrice,
      range_min: result.priceEstimate.rangeMin,
      range_max: result.priceEstimate.rangeMax,
      currency: result.priceEstimate.currency,
      confidence: result.pricingIntelligence?.confidence || result.priceEstimate.confidence,
      quote_count: result.priceEstimate.quoteCount,
      unit_of_measure: result.priceEstimate.unitOfMeasure,
      methodology: result.pricingIntelligence?.methodology || result.priceEstimate.confidenceReason,
      limitations: result.uncertaintyNotes || [],
      disclaimer: result.disclaimer || 'Prices reflect recent public supplier observations.',
      created_at: new Date().toISOString(),
    };

    this.finalResults.set(id, record);
    this.idxFinalResultBySearchId.set(searchId, id);
    this.updateSearchStatus(searchId, 'completed');
    this.flushToDisk();
    return record;
  }

  // --- Relational Queries & Hydration ---

  /**
   * Hydrates a complete search record with all its relational children:
   * Search -> Interpretation -> Sources[] -> Observations[] -> FinalResult
   */
  public getSearchWithRelations(searchId: string): SearchWithFullRelations | null {
    const search = this.searches.get(searchId);
    if (!search) return null;

    // 1-to-1: Query Interpretation
    const interpretationId = this.idxInterpretationsBySearchId.get(searchId);
    const interpretation = interpretationId ? this.interpretations.get(interpretationId) : undefined;

    // 1-to-many: Research Sources
    const sourceIds = this.idxSourcesBySearchId.get(searchId) || [];
    const sources = sourceIds
      .map((id) => this.sources.get(id))
      .filter((s): s is ResearchSourceTableRecord => s !== undefined);

    // 1-to-many: Price Observations
    const observationIds = this.idxObservationsBySearchId.get(searchId) || [];
    const observations = observationIds
      .map((id) => this.observations.get(id))
      .filter((o): o is PriceObservationTableRecord => o !== undefined);

    // 1-to-1: Final Result
    const finalResultId = this.idxFinalResultBySearchId.get(searchId);
    const finalResult = finalResultId ? this.finalResults.get(finalResultId) : undefined;

    return {
      search,
      interpretation,
      sources,
      observations,
      finalResult,
    };
  }

  /**
   * Retrieves recent searches ordered by created_at DESC (using timestamp index).
   */
  public getRecentSearches(limit = 10): SearchWithFullRelations[] {
    const allSearches = Array.from(this.searches.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return allSearches
      .slice(0, limit)
      .map((s) => this.getSearchWithRelations(s.id))
      .filter((s): s is SearchWithFullRelations => s !== null);
  }

  /**
   * Searches for previous cached/persisted results by query string.
   */
  public findSearchesByQuery(queryText: string): SearchWithFullRelations[] {
    const normalized = queryText.trim().toLowerCase();
    const searchIds = this.idxSearchByNormalizedQuery.get(normalized) || [];
    return searchIds
      .map((id) => this.getSearchWithRelations(id))
      .filter((s): s is SearchWithFullRelations => s !== null);
  }

  public getStats() {
    return {
      searchesCount: this.searches.size,
      interpretationsCount: this.interpretations.size,
      sourcesCount: this.sources.size,
      observationsCount: this.observations.size,
      finalResultsCount: this.finalResults.size,
    };
  }
}

// Global Singleton Instance
export const db = new RelationalMarketDatabase();
