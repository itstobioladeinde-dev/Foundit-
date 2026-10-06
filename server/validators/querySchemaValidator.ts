import { ProductQueryInterpretation } from '../../src/types/queryUnderstanding';

export class SchemaValidationError extends Error {
  public readonly validationErrors: string[];

  constructor(message: string, validationErrors: string[] = []) {
    super(message);
    this.name = 'SchemaValidationError';
    this.validationErrors = validationErrors;
  }
}

/**
 * Validates and normalizes raw data against the strict ProductQueryInterpretation schema.
 * Throws SchemaValidationError if the data fails required constraints.
 */
export function validateProductQueryInterpretation(raw: unknown): ProductQueryInterpretation {
  const errors: string[] = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new SchemaValidationError('Interpretation result must be a JSON object.');
  }

  const obj = raw as Record<string, unknown>;

  // 1. Name
  if (typeof obj.name !== 'string' || !obj.name.trim()) {
    errors.push('Field "name" must be a non-empty string.');
  }

  // 2. Category
  if (typeof obj.category !== 'string' || !obj.category.trim()) {
    errors.push('Field "category" must be a non-empty string.');
  }

  // 3. Description
  if (typeof obj.description !== 'string') {
    errors.push('Field "description" must be a string.');
  }

  // 4. Nullable string fields (brand, model, material)
  const normalizeNullableString = (val: unknown): string | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      return trimmed.length > 0 && trimmed.toLowerCase() !== 'null' && trimmed.toLowerCase() !== 'none'
        ? trimmed
        : null;
    }
    return null;
  };

  const brand = normalizeNullableString(obj.brand);
  const model = normalizeNullableString(obj.model);
  const material = normalizeNullableString(obj.material);

  // 5. String Arrays (specifications, possible_variants, search_queries, uncertainties)
  const validateStringArray = (field: string, val: unknown): string[] => {
    if (!Array.isArray(val)) {
      errors.push(`Field "${field}" must be an array of strings.`);
      return [];
    }
    return val
      .map((item) => (typeof item === 'string' ? item.trim() : String(item).trim()))
      .filter((item) => item.length > 0);
  };

  const specifications = validateStringArray('specifications', obj.specifications);
  const possible_variants = validateStringArray('possible_variants', obj.possible_variants);
  const search_queries = validateStringArray('search_queries', obj.search_queries);
  const uncertainties = validateStringArray('uncertainties', obj.uncertainties);

  if (search_queries.length === 0) {
    errors.push('Field "search_queries" must contain at least one valid query string.');
  }

  // 6. Confidence (0.0 to 1.0 or 0 to 100)
  let confidence = typeof obj.confidence === 'number' ? obj.confidence : 0.5;
  if (isNaN(confidence)) {
    errors.push('Field "confidence" must be a valid number.');
    confidence = 0.5;
  } else {
    // If returned as 0-100 scale, normalize to 0-1
    if (confidence > 1 && confidence <= 100) {
      confidence = confidence / 100;
    }
    confidence = Math.max(0, Math.min(1, Math.round(confidence * 100) / 100));
  }

  if (errors.length > 0) {
    throw new SchemaValidationError(
      `Schema validation failed: ${errors.join('; ')}`,
      errors
    );
  }

  return {
    name: (obj.name as string).trim(),
    category: (obj.category as string).trim(),
    description: (obj.description as string).trim(),
    brand,
    model,
    material,
    specifications,
    possible_variants,
    search_queries,
    confidence,
    uncertainties,
  };
}
