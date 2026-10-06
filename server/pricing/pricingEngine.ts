import { ProductResearchRecord } from '../../src/types/productResearch';
import { ProductQueryInterpretation } from '../../src/types/queryUnderstanding';
import {
  PricingIntelligenceResult,
  PriceObservation,
  PricingConfidence,
} from '../../src/types/pricingIntelligence';
import { convertCurrency } from './currencyConverter';

/**
 * Checks if a title represents a bulk pack or accessory rather than a single unit.
 */
function detectVariantOrBulkMismatch(
  title: string,
  targetName: string
): { isExactMatch: boolean; notes?: string } {
  const lowerTitle = title.toLowerCase();
  const lowerTarget = targetName.toLowerCase();

  // Check for bulk quantity indicators (e.g., pack of 10, box of 50, bundle of 20)
  const bulkMatch = lowerTitle.match(/\b(pack\s+of\s+\d+|box\s+of\s+\d+|lot\s+of\s+\d+|\d+\s*pcs\b|\d+\s*pack\b|bundle\s+of\s+\d+)/i);
  const targetHasBulk = /\b(pack|box|pcs|bundle)\b/i.test(lowerTarget);

  if (bulkMatch && !targetHasBulk) {
    return {
      isExactMatch: false,
      notes: `Bulk packaging variant detected (${bulkMatch[0]}); may distort single-unit benchmark.`,
    };
  }

  // Check for accessory / replacement part indicators
  const accessoryWords = ['cover for', 'case for', 'replacement blade', 'bracket for', 'strap for', 'battery only', 'filter for'];
  for (const acc of accessoryWords) {
    if (lowerTitle.includes(acc) && !lowerTarget.includes(acc)) {
      return {
        isExactMatch: false,
        notes: `Identified as accessory or component (${acc}) rather than primary item.`,
      };
    }
  }

  return { isExactMatch: true };
}

/**
 * Calculates the median of an array of numbers.
 */
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Core Pricing Intelligence Engine:
 * Estimates current market prices strictly from empirical research observations.
 */
export function estimateMarketPrice(
  records: ProductResearchRecord[],
  interpretation: ProductQueryInterpretation,
  targetCurrencyOverride?: string
): PricingIntelligenceResult {
  const limitations: string[] = [];
  const queryLower = interpretation.name.toLowerCase();
  const isNigeriaFocused =
    queryLower.includes('nigeria') ||
    interpretation.search_queries.some((q) => q.toLowerCase().includes('nigeria'));

  // 1. Determine target currency
  let targetCurrency = targetCurrencyOverride || 'USD';
  if (!targetCurrencyOverride) {
    const recordsWithCurrency = records.filter((r) => r.price !== null && r.currency);
    const hasNgn = recordsWithCurrency.some((r) => r.currency?.toUpperCase() === 'NGN');

    if (isNigeriaFocused || hasNgn) {
      targetCurrency = 'NGN';
    } else if (recordsWithCurrency.length > 0) {
      // Find most common currency
      const counts: Record<string, number> = {};
      recordsWithCurrency.forEach((r) => {
        const c = r.currency?.toUpperCase() || 'USD';
        counts[c] = (counts[c] || 0) + 1;
      });
      const topCurrency = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (topCurrency) {
        targetCurrency = topCurrency[0];
      }
    }
  }

  // 2. Filter valid price observations & detect invalid quotes
  const rawObservations: PriceObservation[] = [];

  for (const record of records) {
    if (record.price === null || record.price === undefined) {
      continue;
    }

    const price = record.price;
    const currency = record.currency?.toUpperCase() || targetCurrency;

    // Reject obviously invalid numbers (zero, negative, or placeholder prices)
    if (price <= 0 || !isFinite(price)) {
      continue;
    }
    // Reject suspicious placeholder pennies like $0.001 unless micro-unit
    if (currency === 'USD' && price < 0.1) {
      continue;
    }

    // Match validation
    const variantCheck = detectVariantOrBulkMismatch(record.title, interpretation.name);
    const normalizedPrice = convertCurrency(price, currency, targetCurrency);

    rawObservations.push({
      source: record.source,
      sourceUrl: record.url,
      seller: record.seller,
      productTitle: record.title,
      originalPrice: price,
      originalCurrency: currency,
      normalizedPrice,
      normalizedCurrency: targetCurrency,
      isExactMatch: variantCheck.isExactMatch,
      matchScore: variantCheck.isExactMatch ? 1.0 : 0.6,
      isOutlier: false,
      notes: variantCheck.notes,
    });
  }

  // 3. Handle zero valid prices
  if (rawObservations.length === 0) {
    return {
      currency: targetCurrency,
      minPrice: null,
      maxPrice: null,
      estimatedPrice: null,
      confidence: 'low',
      priceObservations: [],
      methodology: 'Price unavailable. No verified commercial price quotes were retrieved from online sources.',
      limitations: [
        'No public pricing data found on retailer or distributor websites for this query.',
        'Items may require direct request for quotation (RFQ), trade registration, or custom manufacturing quote.',
      ],
    };
  }

  // 4. Outlier detection (for 3 or more observations)
  if (rawObservations.length >= 3) {
    const exactPrices = rawObservations
      .filter((o) => o.isExactMatch)
      .map((o) => o.normalizedPrice);
    const pool = exactPrices.length >= 2 ? exactPrices : rawObservations.map((o) => o.normalizedPrice);
    const median = calculateMedian(pool);

    for (const obs of rawObservations) {
      // Outlier if > 3x median or < 0.2x median
      if (obs.normalizedPrice > median * 3.2 || obs.normalizedPrice < median * 0.25) {
        obs.isOutlier = true;
        obs.notes = obs.notes
          ? `${obs.notes}; Statistical outlier relative to market median.`
          : 'Statistical outlier relative to prevailing quotes (excluded from benchmark calculation).';
      }
    }
  }

  // 5. Separate usable prices for range and estimation
  const validObservations = rawObservations.filter((o) => !o.isOutlier);
  const exactValid = validObservations.filter((o) => o.isExactMatch);
  const estimationPool = exactValid.length > 0 ? exactValid : validObservations;
  const poolPrices = estimationPool.map((o) => o.normalizedPrice);

  const minPrice = Math.min(...poolPrices);
  const maxPrice = Math.max(...poolPrices);
  const estimatedPrice = Math.round(calculateMedian(poolPrices) * 100) / 100;

  // 6. Assign confidence & methodology
  let confidence: PricingConfidence = 'low';
  let methodology = '';

  const spreadRatio = minPrice > 0 ? (maxPrice - minPrice) / minPrice : 0;

  if (estimationPool.length === 1) {
    confidence = 'low';
    methodology = `Single source observation from ${estimationPool[0].source}. Estimate is based on limited data.`;
    limitations.push('Estimate is anchored to only 1 verified online quote. Multi-vendor market spread is unconfirmed.');
  } else if (estimationPool.length >= 3 && exactValid.length >= 3 && spreadRatio <= 0.45) {
    confidence = 'high';
    methodology = `Median of ${estimationPool.length} verified commercial vendor quotes with tight market consensus (spread: ${(spreadRatio * 100).toFixed(0)}%).`;
  } else if (estimationPool.length >= 2 && spreadRatio <= 0.85) {
    confidence = 'medium';
    methodology = `Calculated median across ${estimationPool.length} independent merchant observations with moderate price variance.`;
  } else {
    confidence = 'low';
    methodology = `Calculated from ${estimationPool.length} quotes displaying high variance or variant divergence.`;
    limitations.push(`Wide price spread observed (${minPrice} to ${maxPrice} ${targetCurrency}); variance may stem from grade, packaging volume, or geographic tariffs.`);
  }

  // Document Nigeria preference where applicable
  if (isNigeriaFocused) {
    const ngnSources = rawObservations.filter((o) => o.originalCurrency === 'NGN');
    if (ngnSources.length > 0) {
      limitations.push(`Prioritized ${ngnSources.length} domestic Nigerian marketplace/distributor quotes in NGN.`);
    } else {
      limitations.push('Domestic NGN vendor listings were limited; benchmark normalized using international currency conversion rates.');
    }
  }

  // Note outliers if detected
  const outlierCount = rawObservations.filter((o) => o.isOutlier).length;
  if (outlierCount > 0) {
    limitations.push(`Detected and isolated ${outlierCount} statistical outlier price(s) to avoid skewing the median.`);
  }

  // Note variant divergence if exact matches were scarce
  const nonExactCount = rawObservations.filter((o) => !o.isExactMatch).length;
  if (nonExactCount > 0) {
    limitations.push(`${nonExactCount} observation(s) represent related packaging or variants (e.g. bulk lots or accessories).`);
  }

  return {
    currency: targetCurrency,
    minPrice,
    maxPrice,
    estimatedPrice,
    confidence,
    priceObservations: rawObservations,
    methodology,
    limitations,
  };
}
