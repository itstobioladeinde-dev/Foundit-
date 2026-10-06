import assert from 'node:assert';
import { estimateMarketPrice } from '../pricingEngine';
import { ProductResearchRecord } from '../../../src/types/productResearch';
import { ProductQueryInterpretation } from '../../../src/types/queryUnderstanding';

const baseInterpretation: ProductQueryInterpretation = {
  name: '12mm Marine Plywood',
  category: 'Building Materials',
  description: 'Waterproof structural plywood panel',
  brand: null,
  model: null,
  material: 'plywood',
  specifications: ['12mm', 'marine grade'],
  possible_variants: ['Standard Marine', 'BS1088 Marine'],
  search_queries: ['12mm marine plywood price'],
  confidence: 0.9,
  uncertainties: [],
};

function runTestSuite() {
  console.log('--- RUNNING PRICING INTELLIGENCE ENGINE AUTOMATED TESTS ---');

  // Test 1: Multiple Valid Prices
  {
    console.log('[Test 1] Multiple Valid Prices...');
    const records: ProductResearchRecord[] = [
      {
        source: 'Merchant A',
        title: '12mm Marine Plywood Sheet 4x8',
        url: 'https://example.com/a',
        seller: 'Store A',
        brand: null,
        product: '12mm Marine Plywood',
        price: 34.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: ['12mm'],
        retrievedAt: new Date().toISOString(),
      },
      {
        source: 'Merchant B',
        title: '12mm Marine Plywood Sheet 4x8',
        url: 'https://example.com/b',
        seller: 'Store B',
        brand: null,
        product: '12mm Marine Plywood',
        price: 38.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: ['12mm'],
        retrievedAt: new Date().toISOString(),
      },
      {
        source: 'Merchant C',
        title: '12mm Marine Grade Plywood 4x8',
        url: 'https://example.com/c',
        seller: 'Store C',
        brand: null,
        product: '12mm Marine Plywood',
        price: 36.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: ['12mm'],
        retrievedAt: new Date().toISOString(),
      },
    ];

    const result = estimateMarketPrice(records, baseInterpretation, 'USD');
    assert.strictEqual(result.currency, 'USD');
    assert.strictEqual(result.minPrice, 34.0);
    assert.strictEqual(result.maxPrice, 38.0);
    assert.strictEqual(result.estimatedPrice, 36.0); // Median of [34, 36, 38]
    assert.strictEqual(result.confidence, 'high');
    assert.strictEqual(result.priceObservations.length, 3);
    console.log('✓ PASS: Correctly calculated range [34, 38] and median benchmark 36 with high confidence.');
  }

  // Test 2: One Valid Price
  {
    console.log('[Test 2] One Valid Price...');
    const records: ProductResearchRecord[] = [
      {
        source: 'Solo Merchant',
        title: '12mm Marine Plywood Sheet',
        url: 'https://example.com/solo',
        seller: 'Solo Seller',
        brand: null,
        product: '12mm Marine Plywood',
        price: 42.5,
        currency: 'USD',
        availability: 'In Stock',
        specifications: ['12mm'],
        retrievedAt: new Date().toISOString(),
      },
    ];

    const result = estimateMarketPrice(records, baseInterpretation, 'USD');
    assert.strictEqual(result.currency, 'USD');
    assert.strictEqual(result.minPrice, 42.5);
    assert.strictEqual(result.maxPrice, 42.5);
    assert.strictEqual(result.estimatedPrice, 42.5);
    assert.strictEqual(result.confidence, 'low');
    assert(result.methodology.includes('limited data'));
    console.log('✓ PASS: Single price flagged as low confidence with limited data caveat.');
  }

  // Test 3: No Prices
  {
    console.log('[Test 3] No Prices (Missing / Catalog Only)...');
    const records: ProductResearchRecord[] = [
      {
        source: 'Catalog Site',
        title: '12mm Marine Plywood Specification Sheet',
        url: 'https://example.com/spec',
        seller: null,
        brand: null,
        product: '12mm Marine Plywood',
        price: null,
        currency: null,
        availability: null,
        specifications: ['12mm'],
        retrievedAt: new Date().toISOString(),
      },
    ];

    const result = estimateMarketPrice(records, baseInterpretation, 'USD');
    assert.strictEqual(result.minPrice, null);
    assert.strictEqual(result.maxPrice, null);
    assert.strictEqual(result.estimatedPrice, null);
    assert.strictEqual(result.confidence, 'low');
    assert(result.methodology.includes('Price unavailable'));
    assert(result.limitations.length > 0);
    console.log('✓ PASS: Correctly returned price unavailable state without inventing any numbers.');
  }

  // Test 4: Different Currencies (e.g. NGN and USD)
  {
    console.log('[Test 4] Different Currencies & Nigeria Context...');
    const nigeriaInterpretation: ProductQueryInterpretation = {
      ...baseInterpretation,
      name: '12mm marine plywood price in Nigeria',
      search_queries: ['12mm marine plywood Nigeria price'],
    };

    const records: ProductResearchRecord[] = [
      {
        source: 'Nigerian Builder Hub',
        title: '12mm Marine Plywood Lagos',
        url: 'https://example.ng/plywood',
        seller: 'Alaba Market Wood',
        brand: null,
        product: '12mm Marine Plywood',
        price: 45000,
        currency: 'NGN',
        availability: 'In Stock',
        specifications: ['12mm'],
        retrievedAt: new Date().toISOString(),
      },
      {
        source: 'US Exporter',
        title: '12mm Marine Plywood Export Sheet',
        url: 'https://example.com/export',
        seller: 'Global Wood',
        brand: null,
        product: '12mm Marine Plywood',
        price: 32.0, // 32 USD ≈ 47,761 NGN
        currency: 'USD',
        availability: 'In Stock',
        specifications: ['12mm'],
        retrievedAt: new Date().toISOString(),
      },
    ];

    const result = estimateMarketPrice(records, nigeriaInterpretation);
    assert.strictEqual(result.currency, 'NGN', 'Target currency should prefer NGN for Nigeria query');
    assert(result.estimatedPrice !== null && result.estimatedPrice > 10000, 'Price should be normalized in NGN');
    // Ensure original currency was preserved in observations
    assert.strictEqual(result.priceObservations[0].originalCurrency, 'NGN');
    assert.strictEqual(result.priceObservations[1].originalCurrency, 'USD');
    assert.strictEqual(result.priceObservations[1].normalizedCurrency, 'NGN');
    console.log(`✓ PASS: Preferred NGN currency (${result.estimatedPrice} NGN) while preserving original source currencies.`);
  }

  // Test 5: Outlier Prices
  {
    console.log('[Test 5] Outlier Prices Detection...');
    const records: ProductResearchRecord[] = [
      {
        source: 'Vendor 1',
        title: '12mm Marine Plywood',
        url: 'https://example.com/1',
        seller: 'V1',
        brand: null,
        product: '12mm Marine Plywood',
        price: 35.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: [],
        retrievedAt: new Date().toISOString(),
      },
      {
        source: 'Vendor 2',
        title: '12mm Marine Plywood',
        url: 'https://example.com/2',
        seller: 'V2',
        brand: null,
        product: '12mm Marine Plywood',
        price: 36.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: [],
        retrievedAt: new Date().toISOString(),
      },
      {
        source: 'Vendor 3',
        title: '12mm Marine Plywood',
        url: 'https://example.com/3',
        seller: 'V3',
        brand: null,
        product: '12mm Marine Plywood',
        price: 37.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: [],
        retrievedAt: new Date().toISOString(),
      },
      {
        source: 'Gouging Vendor (Outlier)',
        title: '12mm Marine Plywood Extreme Listing',
        url: 'https://example.com/outlier',
        seller: 'Gouger',
        brand: null,
        product: '12mm Marine Plywood',
        price: 350.0, // 10x market price
        currency: 'USD',
        availability: 'In Stock',
        specifications: [],
        retrievedAt: new Date().toISOString(),
      },
    ];

    const result = estimateMarketPrice(records, baseInterpretation, 'USD');
    const outlier = result.priceObservations.find((o) => o.originalPrice === 350.0);
    assert(outlier?.isOutlier === true, 'Price of $350 should be flagged as an outlier');
    // Benchmark price should not be distorted by the $350 price
    assert(result.estimatedPrice! < 40.0, `Estimated price (${result.estimatedPrice}) should exclude the $350 outlier`);
    console.log(`✓ PASS: Identified $350 as outlier; benchmark median calculated as $${result.estimatedPrice}.`);
  }

  // Test 6: Different Variants (Bulk pack vs single unit)
  {
    console.log('[Test 6] Different Variants (Bulk vs Single Unit)...');
    const records: ProductResearchRecord[] = [
      {
        source: 'Retailer A',
        title: '12mm Marine Plywood Single Sheet',
        url: 'https://example.com/sheet',
        seller: 'Retailer',
        brand: null,
        product: '12mm Marine Plywood',
        price: 35.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: [],
        retrievedAt: new Date().toISOString(),
      },
      {
        source: 'Wholesaler B',
        title: '12mm Marine Plywood Pack of 25 Sheets',
        url: 'https://example.com/pack',
        seller: 'Wholesaler',
        brand: null,
        product: '12mm Marine Plywood Pack',
        price: 750.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: [],
        retrievedAt: new Date().toISOString(),
      },
    ];

    const result = estimateMarketPrice(records, baseInterpretation, 'USD');
    const bulkObservation = result.priceObservations.find((o) => o.productTitle.includes('Pack of 25'));
    assert.strictEqual(bulkObservation?.isExactMatch, false, 'Bulk pack should not be treated as exact match');
    // Benchmark should be anchored to the single sheet price
    assert.strictEqual(result.estimatedPrice, 35.0);
    console.log('✓ PASS: Distinguished single sheet from bulk variant without corrupting benchmark.');
  }

  // Test 7: Conflicting Sources with High Variance
  {
    console.log('[Test 7] Conflicting Sources with High Variance...');
    const records: ProductResearchRecord[] = [
      {
        source: 'Budget Depot',
        title: '12mm Marine Plywood Budget Grade',
        url: 'https://example.com/budget',
        seller: 'Budget Store',
        brand: null,
        product: '12mm Marine Plywood',
        price: 20.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: [],
        retrievedAt: new Date().toISOString(),
      },
      {
        source: 'Luxury Marine Lumber',
        title: '12mm Marine Plywood Premium Teak Face',
        url: 'https://example.com/luxury',
        seller: 'Luxury Store',
        brand: null,
        product: '12mm Marine Plywood',
        price: 110.0,
        currency: 'USD',
        availability: 'In Stock',
        specifications: [],
        retrievedAt: new Date().toISOString(),
      },
    ];

    const result = estimateMarketPrice(records, baseInterpretation, 'USD');
    assert.strictEqual(result.confidence, 'low', 'Confidence should be low when sources conflict with >400% variance');
    assert(result.limitations.some((l) => l.includes('Wide price spread')));
    console.log(`✓ PASS: Flagged conflicting sources (${result.minPrice} to ${result.maxPrice}) with low confidence and limitation note.`);
  }

  console.log('\n--- ALL 7 AUTOMATED PRICING TESTS PASSED! ---');
}

runTestSuite();
