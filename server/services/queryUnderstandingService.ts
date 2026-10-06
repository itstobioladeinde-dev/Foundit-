import { GoogleGenAI, Type } from '@google/genai';
import { ProductQueryInterpretation } from '../../src/types/queryUnderstanding';
import { validateProductQueryInterpretation } from '../validators/querySchemaValidator';
import { parseProductQueryHeuristically } from './heuristicQueryParser';

/**
 * Initializes GoogleGenAI client using server-side environment variables.
 * Never accessible or exposed to client-side code.
 */
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are a precision product taxonomy and commercial procurement query interpreter.
Your mission is to understand natural-language product and material search queries and transform them into a strict, structured research brief.

Guidelines:
1. "name": The clean, canonical product or material name (strip extraneous query words like "price in", "where to buy", "cost").
2. "category": Concise industry or procurement classification (e.g., "Building Materials", "Consumer Electronics", "Industrial Piping", "PPE & Safety", "Commercial Furniture").
3. "description": A concise 1-2 sentence description explaining the item's standard commercial purpose.
4. "brand": Brand name if explicitly mentioned in query or definitively identified; otherwise null.
5. "model": Specific model identifier or number if stated in query; otherwise null.
6. "material": Primary base material (e.g. "plywood", "stainless steel 304", "HDPE", "mesh"); otherwise null.
7. "specifications": Array of ONLY the explicit measurements, dimensions, thicknesses, tolerances, grades, or capacities provided in the query. DO NOT invent specifications the user did not specify!
8. "possible_variants": Array of 2-4 standard commercial variants, sizes, or grades available on the market for this item.
9. "search_queries": Array of 3-5 specific, commercial web search queries designed to find current retailer, distributor, or supplier price quotes (preserve geographic/country references if user provided them!).
10. "confidence": Number between 0.0 and 1.0 representing how clearly the query specifies an unambiguous product.
11. "uncertainties": Array of explicit ambiguities or missing information (e.g., unspecified size, unknown thickness, ambiguous brand).

Output MUST conform strictly to the JSON schema.`;

/**
 * Primary server-side service abstraction: understandProductQuery(query)
 * Analyzes the user's natural language product query and returns validated, structured information.
 */
export async function understandProductQuery(rawQuery: string): Promise<ProductQueryInterpretation> {
  const query = rawQuery?.trim();
  if (!query) {
    throw new Error('Query must be a non-empty string.');
  }

  const ai = getGeminiClient();

  // If Gemini API key is configured, execute via gemini-3.8-flash with JSON schema
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analyze this product query and return structured data: "${query}"`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'Normalized product or material title',
              },
              category: {
                type: Type.STRING,
                description: 'Product or material procurement category',
              },
              description: {
                type: Type.STRING,
                description: 'Short objective description of the item',
              },
              brand: {
                type: Type.STRING,
                description: 'Brand name if specified, otherwise null',
                nullable: true,
              },
              model: {
                type: Type.STRING,
                description: 'Model identifier if specified, otherwise null',
                nullable: true,
              },
              material: {
                type: Type.STRING,
                description: 'Base material if specified, otherwise null',
                nullable: true,
              },
              specifications: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Explicit measurements, standards, or ratings stated in the query',
              },
              possible_variants: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Common market variants or grades',
              },
              search_queries: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3-5 search queries for distributor/pricing research',
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Confidence score from 0.0 to 1.0',
              },
              uncertainties: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Ambiguities or missing attributes',
              },
            },
            required: [
              'name',
              'category',
              'description',
              'specifications',
              'possible_variants',
              'search_queries',
              'confidence',
              'uncertainties',
            ],
          },
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        // Strict runtime validation
        return validateProductQueryInterpretation(parsed);
      }
    } catch (aiError: unknown) {
      console.warn(
        '[MarketProbe] Gemini query understanding failed, falling back to heuristic parser:',
        aiError instanceof Error ? aiError.message : aiError
      );
    }
  }

  // Graceful fallback: Heuristic parser passes through the exact same schema validator
  const heuristicResult = parseProductQueryHeuristically(query);
  return validateProductQueryInterpretation(heuristicResult);
}
