import { MarketResearchResult } from '../src/types/market';
import { MarketSearchProvider } from './providers/types';
import { MockSearchProvider } from './providers/mockProvider';

export class SearchValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'SearchValidationError';
    this.statusCode = statusCode;
  }
}

export const MAX_QUERY_LENGTH = 200;

// Provider registry - configurable for future AI engines
let activeProvider: MarketSearchProvider = new MockSearchProvider();

export function setMarketSearchProvider(provider: MarketSearchProvider): void {
  activeProvider = provider;
}

export function getActiveMarketSearchProvider(): MarketSearchProvider {
  return activeProvider;
}

/**
 * Backend abstraction for physical product & material search.
 * Validates input, applies constraints, and queries the configured market provider.
 *
 * @param rawQuery The unvalidated raw query string from the client
 * @returns Market research result payload
 */
export async function searchProduct(rawQuery: unknown): Promise<MarketResearchResult> {
  // 1. Type validation
  if (typeof rawQuery !== 'string') {
    throw new SearchValidationError('Search query must be a valid text string.', 400);
  }

  // 2. Trim unnecessary whitespace
  const trimmed = rawQuery.trim();

  // 3. Validate non-empty
  if (trimmed.length === 0) {
    throw new SearchValidationError('Search query cannot be empty. Please enter an item or material name.', 400);
  }

  // 4. Maximum query length constraint
  if (trimmed.length > MAX_QUERY_LENGTH) {
    throw new SearchValidationError(
      `Search query exceeds maximum length of ${MAX_QUERY_LENGTH} characters (received ${trimmed.length}).`,
      400
    );
  }

  // 5. Sanitize invisible/control characters while preserving unicode and punctuation
  const sanitized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  if (!sanitized) {
    throw new SearchValidationError('Search query contained only invalid control characters.', 400);
  }

  // 6. Execute search via provider abstraction
  try {
    return await activeProvider.search(sanitized);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Provider search failed.';
    throw new SearchValidationError(`Market search service error: ${message}`, 500);
  }
}
