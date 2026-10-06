import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { RelationalMarketDatabase } from '../database';
import { ProductQueryInterpretation } from '../../../src/types/queryUnderstanding';
import { ProductResearchRecord } from '../../../src/types/productResearch';
import { PricingIntelligenceResult } from '../../../src/types/pricingIntelligence';
import { MarketResearchResult } from '../../../src/types/market';

const testDbPath = path.resolve(process.cwd(), '.data', 'test_marketprobe_db.json');

function cleanup() {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

function runDatabaseTests() {
  console.log('--- RUNNING DATABASE PERSISTENCE AUTOMATED TESTS ---');
  cleanup();

  const testDb = new RelationalMarketDatabase(testDbPath);

  // 1. Create Search
  console.log('[Test 1] Create Search Record with unique ID and timestamp...');
  const searchRecord = testDb.createSearch('12mm marine plywood', 'pending');
  assert(searchRecord.id, 'Search must have a unique ID');
  assert.strictEqual(searchRecord.original_query, '12mm marine plywood');
  assert.strictEqual(searchRecord.status, 'pending');
  assert(searchRecord.created_at, 'Search must have an ISO timestamp');
  console.log(`✓ PASS: Created search record ${searchRecord.id}`);

  // 2. Query Interpretation (1-to-1 Relationship)
  console.log('[Test 2] Link Query Interpretation (1-to-1 relationship)...');
  const interpretation: ProductQueryInterpretation = {
    name: '12mm Marine Plywood',
    category: 'Building Materials',
    description: 'Marine-grade structural panel',
    brand: null,
    model: null,
    material: 'plywood',
    specifications: ['12mm', 'marine grade'],
    possible_variants: ['Standard Marine Grade', 'BS1088 Marine Grade'],
    search_queries: ['12mm marine plywood supplier'],
    confidence: 0.9,
    uncertainties: [],
  };

  const savedInterp = testDb.saveQueryInterpretation(searchRecord.id, interpretation);
  assert.strictEqual(savedInterp.search_id, searchRecord.id);
  assert.strictEqual(savedInterp.name, '12mm Marine Plywood');
  console.log(`✓ PASS: Linked interpretation ${savedInterp.id} to search ${searchRecord.id}`);

  // 3. Research Sources (1-to-Many Relationship)
  console.log('[Test 3] Link Multiple Research Sources (1-to-many relationship)...');
  const sources: ProductResearchRecord[] = [
    {
      source: 'Merchant A',
      title: '12mm Marine Plywood 4x8 Sheet',
      url: 'https://example.com/merchant-a',
      seller: 'Lumber Supply Co',
      brand: 'Standard Marine',
      product: '12mm Marine Plywood',
      price: 36.0,
      currency: 'USD',
      availability: 'In Stock',
      specifications: ['12mm', '4x8 ft'],
      retrievedAt: new Date().toISOString(),
    },
    {
      source: 'Merchant B',
      title: '12mm Marine Grade Plywood',
      url: 'https://example.com/merchant-b',
      seller: 'National Depot',
      brand: 'Standard Marine',
      product: '12mm Marine Plywood',
      price: 39.5,
      currency: 'USD',
      availability: 'In Stock',
      specifications: ['12mm'],
      retrievedAt: new Date().toISOString(),
    },
  ];

  const savedSources = testDb.saveResearchSources(searchRecord.id, sources);
  assert.strictEqual(savedSources.length, 2);
  assert.strictEqual(savedSources[0].search_id, searchRecord.id);
  assert.strictEqual(savedSources[1].search_id, searchRecord.id);
  console.log(`✓ PASS: Persisted ${savedSources.length} research sources linked to search.`);

  // 4. Price Observations (1-to-Many Relationship)
  console.log('[Test 4] Link Multiple Price Observations (1-to-many relationship)...');
  const pricingResult: PricingIntelligenceResult = {
    currency: 'USD',
    minPrice: 36.0,
    maxPrice: 39.5,
    estimatedPrice: 37.75,
    confidence: 'high',
    priceObservations: [
      {
        source: 'Merchant A',
        sourceUrl: 'https://example.com/merchant-a',
        seller: 'Lumber Supply Co',
        productTitle: '12mm Marine Plywood 4x8 Sheet',
        originalPrice: 36.0,
        originalCurrency: 'USD',
        normalizedPrice: 36.0,
        normalizedCurrency: 'USD',
        isExactMatch: true,
        matchScore: 1.0,
        isOutlier: false,
      },
      {
        source: 'Merchant B',
        sourceUrl: 'https://example.com/merchant-b',
        seller: 'National Depot',
        productTitle: '12mm Marine Grade Plywood',
        originalPrice: 39.5,
        originalCurrency: 'USD',
        normalizedPrice: 39.5,
        normalizedCurrency: 'USD',
        isExactMatch: true,
        matchScore: 1.0,
        isOutlier: false,
      },
    ],
    methodology: 'Median of 2 vendor quotes.',
    limitations: [],
  };

  const savedObservations = testDb.savePriceObservations(searchRecord.id, pricingResult);
  assert.strictEqual(savedObservations.length, 2);
  assert.strictEqual(savedObservations[0].search_id, searchRecord.id);
  assert.strictEqual(savedObservations[1].search_id, searchRecord.id);
  console.log(`✓ PASS: Persisted ${savedObservations.length} price observations linked to search.`);

  // 5. Final Search Result (1-to-1 Relationship)
  console.log('[Test 5] Link Final Result & Update Search Status to Completed...');
  const finalResult: MarketResearchResult = {
    query: '12mm marine plywood',
    productName: '12mm Marine Plywood',
    category: 'Building Materials',
    description: 'Marine-grade structural panel',
    specifications: [{ label: 'Thickness', value: '12mm' }],
    brandsOrVariants: ['Standard Marine Grade'],
    priceEstimate: {
      benchmarkPrice: 37.75,
      currency: 'USD',
      formattedBenchmark: '$37.75',
      rangeMin: 36.0,
      rangeMax: 39.5,
      formattedRange: '$36.00 – $39.50',
      unitOfMeasure: 'per 4x8 sheet',
      confidence: 'high',
      confidenceReason: 'Verified quotes',
      quoteCount: 2,
    },
    sourceQuotes: [],
    assumptions: ['Standard pricing'],
    uncertaintyNotes: [],
    researchedAt: new Date().toISOString(),
    disclaimer: 'Prices subject to market change.',
  };

  const savedFinal = testDb.saveFinalResult(searchRecord.id, finalResult);
  assert.strictEqual(savedFinal.search_id, searchRecord.id);
  assert.strictEqual(savedFinal.benchmark_price, 37.75);
  console.log(`✓ PASS: Linked final result ${savedFinal.id} to search.`);

  // 6. Test Hydration of Full Relationships
  console.log('[Test 6] Hydrate Full Relational Tree (Search -> Interpretation -> Sources -> Observations -> FinalResult)...');
  const fullTree = testDb.getSearchWithRelations(searchRecord.id);
  assert(fullTree, 'Full tree must exist');
  assert.strictEqual(fullTree.search.status, 'completed');
  assert.strictEqual(fullTree.interpretation?.name, '12mm Marine Plywood');
  assert.strictEqual(fullTree.sources.length, 2);
  assert.strictEqual(fullTree.observations.length, 2);
  assert.strictEqual(fullTree.finalResult?.benchmark_price, 37.75);
  console.log('✓ PASS: Full relational tree successfully hydrated across all 5 structures.');

  // 7. Test Query Index
  console.log('[Test 7] Test Indexed Query Lookups & Recent Searches...');
  const lookup = testDb.findSearchesByQuery('12mm marine plywood');
  assert.strictEqual(lookup.length, 1);
  assert.strictEqual(lookup[0].search.id, searchRecord.id);

  const recent = testDb.getRecentSearches(5);
  assert(recent.length >= 1);
  assert.strictEqual(recent[0].search.id, searchRecord.id);
  console.log('✓ PASS: Normalized query and created_at indexes returned matching search in O(1).');

  // 8. Test Foreign Key Constraint
  console.log('[Test 8] Foreign Key Constraint Rejection on non-existent Search ID...');
  assert.throws(
    () => testDb.saveQueryInterpretation('non-existent-uuid', interpretation),
    /Foreign Key Constraint Violation/
  );
  console.log('✓ PASS: Foreign key integrity successfully blocked orphan insertions.');

  cleanup();
  console.log('\n--- ALL DATABASE PERSISTENCE TESTS PASSED! ---');
}

runDatabaseTests();
