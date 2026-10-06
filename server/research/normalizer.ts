import { ProductResearchRecord } from '../../src/types/productResearch';

// Blocklist of private / internal hostnames to prevent SSRF or link poisoning
const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254', // Cloud metadata service
  'metadata.google.internal',
  'instance-data',
];

/**
 * Checks if a hostname belongs to an internal or private network.
 */
function isPrivateOrLocalHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.some((b) => lower === b || lower.endsWith(`.${b}`))) {
    return true;
  }
  // Check private IPv4 blocks: 10.x, 192.168.x, 172.16-31.x
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(lower)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(lower)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(lower)) return true;
  if (lower.endsWith('.local') || lower.endsWith('.internal')) return true;

  return false;
}

/**
 * Sanitizes untrusted text retrieved from external web pages.
 * Strips prompt-injection patterns, HTML tags, control chars, and limits length.
 */
export function sanitizeUntrustedText(text: unknown, maxLength = 300): string {
  if (typeof text !== 'string') return '';

  return (
    text
      // Neutralize prompt injection phrases
      .replace(/(ignore\s+(all\s+)?(previous|prior)\s+instructions)/gi, '[REDACTED]')
      .replace(/<\|im_start\|>|<\|im_end\|>|\[SYSTEM\]/gi, '')
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip control chars
      .replace(/[\r\n\t]+/g, ' ') // Collapse whitespace
      .trim()
      .slice(0, maxLength)
  );
}

/**
 * Validates and sanitizes external web URLs.
 * Ensures URLs use valid http/https protocols and are not targeting private/internal network addresses.
 */
export function sanitizeUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  try {
    const parsed = new URL(trimmed);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }

    // SSRF & private IP check
    if (isPrivateOrLocalHost(parsed.hostname)) {
      return '';
    }

    // Ensure valid public domain format
    if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return '';
    }

    return parsed.toString();
  } catch {
    // Malformed URL
    return '';
  }
}

/**
 * Normalizes and validates extracted prices.
 */
export function normalizePrice(rawPrice: unknown): number | null {
  if (rawPrice === null || rawPrice === undefined || rawPrice === '') return null;
  if (typeof rawPrice === 'number' && !isNaN(rawPrice) && isFinite(rawPrice) && rawPrice > 0) {
    if (rawPrice > 100000000) return null; // Reject unrealistic outlier
    return Math.round(rawPrice * 100) / 100;
  }
  if (typeof rawPrice === 'string') {
    const cleanStr = rawPrice.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanStr);
    if (!isNaN(num) && isFinite(num) && num > 0) {
      if (num > 100000000) return null;
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
 * Deduplicates and filters raw search records with strict untrusted content defenses.
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

    // Deduplicate by normalized URL
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
