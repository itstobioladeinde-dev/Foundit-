import { MarketResearchResult } from '../types/market';

export const MAX_CLIENT_QUERY_LENGTH = 200;

export interface SearchApiResponse {
  success: boolean;
  data?: MarketResearchResult;
  error?: string;
}

export class ClientValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientValidationError';
  }
}

/**
 * Validates and sanitizes a query prior to dispatching network requests.
 */
export function validateSearchQuery(rawQuery: string): string {
  if (typeof rawQuery !== 'string') {
    throw new ClientValidationError('Search query must be text.');
  }

  const trimmed = rawQuery.trim();

  if (trimmed.length === 0) {
    throw new ClientValidationError('Please enter a product, material, or item name to search.');
  }

  if (trimmed.length > MAX_CLIENT_QUERY_LENGTH) {
    throw new ClientValidationError(
      `Query is too long (${trimmed.length} characters). Please keep it under ${MAX_CLIENT_QUERY_LENGTH} characters.`
    );
  }

  return trimmed;
}

/**
 * Submits the query to the server-side endpoint.
 * Ensures the client code never interacts directly with underlying AI SDKs or keys.
 *
 * @param query The user's search text
 * @param signal Optional AbortSignal to cancel in-flight requests
 */
export async function searchProductApi(
  query: string,
  signal?: AbortSignal
): Promise<MarketResearchResult> {
  // Validate and trim on client side first
  const sanitizedQuery = validateSearchQuery(query);

  let response: Response;
  try {
    response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sanitizedQuery }),
      signal,
    });
  } catch (networkError: unknown) {
    if (signal?.aborted) {
      throw new Error('Search request was canceled.');
    }
    throw new Error('Unable to connect to the search server. Please check your network connection.');
  }

  let payload: SearchApiResponse;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Server returned an unreadable response (HTTP ${response.status}).`);
  }

  if (!response.ok || !payload.success || !payload.data) {
    const errorMsg = payload.error || `Server returned error (HTTP ${response.status}).`;
    throw new Error(errorMsg);
  }

  return payload.data;
}
