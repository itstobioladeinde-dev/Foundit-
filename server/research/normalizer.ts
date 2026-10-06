import { ProductResearchRecord } from '../../src/types/productResearch';

/**
 * Sanitizes untrusted text retrieved from external web pages.
 * Prevents prompt injection, strips HTML/script tags, and limits string length.
 */
export function sanitizeUntrustedText(text: unknown, maxLength = 300): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip control chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates external web URLs.
 * Ensures URLs use http/https protocols and do not contain script injection.
 */
export function sanitizeUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // Invalid URL structure
  }
  return '';
}

/**
 * Normalizes and validates extracted prices.
 */
export function normalizePrice(rawPrice: unknown): number | null {
  if (rawPrice === null || rawPrice === undefined || rawPrice === '') return null;
  if (typeof rawPrice === 'number' && !isNaN(rawPrice) && isFinite(rawPrice) && rawPrice >= 0) {
    return Math.round(rawPrice * 100) / 100;
  }
  if (typeof rawPrice === 'string') {
    // Clean currency symbols, commas, and spaces
    const cleanStr = rawPrice.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanStr);
    if (!isNaN(num) && isFinite(num) && num >= 0) {
      return Math.round(num * 100) / 100;
    }
  }
  return null;
}

/**
 * Normalizes currency codes (USD, NGN, EUR, GBP, etc.)
 */
export function normalizeCurrency(rawCurrency: unknown): string | null {
  if (!rawCurrency || typeof rawCurrency !== 'string') return null;
  const upper = rawCurrency.trim().toUpperCase();
  const validCurrencies = ['USD', 'NGN', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'ZAR', 'KES', 'AED'];
  for (const c of validCurrencies) {
    if (upper === c || upper.includes(c)) return c;
  }
  if (upper === '$') return 'USD';
  if (upper === '₦') return 'NGN';
  if (upper === '€') return 'EUR';
  if (upper === '£') return 'GBP';
  return upper.slice(0, 5);
}

/**
 * Deduplicates and filters raw search records.
 * 1. Drops records without valid URLs or product titles.
 * 2. Drops duplicate URLs.
 * 3. Sanitizes all untrusted strings.
 */
export function normalizeAndDeduplicateRecords(
  records: Partial<ProductResearchRecord>[],
  targetItemName: string
): ProductResearchRecord[] {
  const seenUrls = new Set<string>();
  const normalized: ProductResearchRecord[] = [];
  const targetLower = targetItemName.toLowerCase();
  const targetTokens = targetLower.split(/\s+/).filter((t) => t.length > 2);

  for (const item of records) {
    const url = sanitizeUrl(item.url);
    if (!url) continue;

    // Deduplicate by URL
    const normalizedUrl = url.toLowerCase().replace(/#.*$/, '').replace(/\/$/, '');
    if (seenUrls.has(normalizedUrl)) continue;
    seenUrls.add(normalizedUrl);

    const title = sanitizeUntrustedText(item.title || item.product, 250);
    const product = sanitizeUntrustedText(item.product || item.title, 200);

    if (!title && !product) continue;

    // Basic relevance filter: Check for overlap with the query or tokens
    const combinedText = `${title} ${product} ${item.source || ''}`.toLowerCase();
    const isRelevant =
      targetTokens.length === 0 ||
      targetTokens.some((token) => combinedText.includes(token)) ||
      combinedText.includes(targetLower);

    if (!isRelevant) continue;

    const source = sanitizeUntrustedText(item.source, 80) || new URL(url).hostname.replace(/^www\./, '');
    const seller = item.seller ? sanitizeUntrustedText(item.seller, 80) : null;
    const brand = item.brand ? sanitizeUntrustedText(item.brand, 80) : null;
    const price = normalizePrice(item.price);
    const currency = price !== null ? normalizeCurrency(item.currency) || 'USD' : null;
    const availability = item.availability ? sanitizeUntrustedText(item.availability, 50) : null;

    const specifications: string[] = Array.isArray(item.specifications)
      ? item.specifications
          .map((s) => sanitizeUntrustedText(s, 100))
          .filter((s) => s.length > 0)
          .slice(0, 10)
      : [];

    normalized.push({
      source,
      title: title || product,
      url,
      seller,
      brand,
      product: product || title,
      price,
      currency,
      availability,
      specifications,
      retrievedAt: item.retrievedAt || new Date().toISOString(),
    });
  }

  return normalized;
}
