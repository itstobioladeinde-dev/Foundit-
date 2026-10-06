import { ProductQueryInterpretation } from '../../src/types/queryUnderstanding';

/**
 * Robust heuristic natural-language parser for physical products, materials, and equipment.
 * Used when offline, during test suites, or as a reliable fallback when GEMINI_API_KEY is unset.
 */
export function parseProductQueryHeuristically(query: string): ProductQueryInterpretation {
  const cleaned = query.trim();
  const lower = cleaned.toLowerCase();

  // 1. Extract physical measurements & dimensions (e.g., 12mm, 2 inch, 4x8, 5000 mAh, 1/2", Schedule 40)
  const measurements: string[] = [];
  const measurementRegexes = [
    /\b\d+(\.\d+)?\s*(mm|cm|m|inch|inches|in|"|ft|feet|gauge|ga|kg|g|lbs?|oz|mah|w|kw|v|ton|tons|bar|psi)\b/gi,
    /\b\d+\/\d+\s*(inch|inches|in|")?\b/gi,
    /\b\d+\s*x\s*\d+\b/gi,
    /\b(schedule|sch)\s*\d+\b/gi,
    /\btype\s*[i|v|x\d]+/gi,
    /\bgrade\s*[a-z0-9]+/gi,
  ];

  for (const regex of measurementRegexes) {
    const matches = lower.match(regex);
    if (matches) {
      matches.forEach((m) => {
        if (!measurements.includes(m.trim())) {
          measurements.push(m.trim());
        }
      });
    }
  }

  // 2. Detect common materials
  const materialKeywords: Record<string, string> = {
    plywood: 'plywood',
    timber: 'wood / timber',
    lumber: 'wood / lumber',
    pine: 'pine wood',
    oak: 'oak wood',
    hardwood: 'hardwood',
    birch: 'birch wood',
    mdf: 'medium-density fibreboard (MDF)',
    'cement board': 'cementitious composite',
    cement: 'cement',
    concrete: 'concrete',
    steel: 'steel',
    'stainless steel': 'stainless steel',
    aluminum: 'aluminum',
    aluminium: 'aluminum',
    copper: 'copper',
    brass: 'brass',
    iron: 'iron',
    plastic: 'polymer / plastic',
    pvc: 'polyvinyl chloride (PVC)',
    polyethylene: 'polyethylene (PE)',
    hdpe: 'high-density polyethylene (HDPE)',
    polycarbonate: 'polycarbonate',
    mesh: 'textile / mesh',
    leather: 'leather',
    glass: 'glass',
    rubber: 'rubber',
    ceramic: 'ceramic',
  };

  let detectedMaterial: string | null = null;
  for (const [key, val] of Object.entries(materialKeywords)) {
    if (lower.includes(key)) {
      detectedMaterial = val;
      break;
    }
  }

  // 3. Detect prominent brands
  const brandKeywords = [
    'samsung',
    'apple',
    'sony',
    'lg',
    'bosch',
    'dewalt',
    'makita',
    'milwaukee',
    '3m',
    'msa',
    'honeywell',
    'kask',
    'petzl',
    'herman miller',
    'steelcase',
    'haworth',
    'caterpillar',
    'mcmaster',
    'weyerhaeuser',
    'georgia-pacific',
    'usg',
    'james hardie',
  ];

  let detectedBrand: string | null = null;
  for (const b of brandKeywords) {
    if (lower.includes(b)) {
      detectedBrand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }

  // 4. Detect models or numbers (e.g. A55, S24, M18, Aeron, V-Gard)
  let detectedModel: string | null = null;
  const modelMatch = lower.match(/\b([a-z]\d{2,4}|[a-z]{1,3}-\d{2,4}|\d{4}[a-z]?)\b/i);
  if (modelMatch && (!detectedBrand || !modelMatch[0].toLowerCase().includes(detectedBrand.toLowerCase()))) {
    detectedModel = modelMatch[0].toUpperCase();
  }

  // 5. Detect general category
  let category = 'Commercial & Industrial Goods';
  if (lower.includes('plywood') || lower.includes('cement') || lower.includes('lumber') || lower.includes('drywall') || lower.includes('insulation')) {
    category = 'Building Materials & Construction';
  } else if (lower.includes('phone') || lower.includes('samsung') || lower.includes('apple') || lower.includes('laptop') || lower.includes('camera') || lower.includes('5g')) {
    category = 'Consumer Electronics & Telecommunications';
  } else if (lower.includes('pipe') || lower.includes('tube') || lower.includes('fitting') || lower.includes('valve') || lower.includes('flange') || lower.includes('steel')) {
    category = 'Industrial Piping & Metal Products';
  } else if (lower.includes('helmet') || lower.includes('hard hat') || lower.includes('goggles') || lower.includes('gloves') || lower.includes('ppe') || lower.includes('respirator')) {
    category = 'Personal Protective Equipment (PPE) & Safety';
  } else if (lower.includes('chair') || lower.includes('desk') || lower.includes('table') || lower.includes('furniture')) {
    category = 'Commercial & Office Furniture';
  }

  // 6. Gather explicit specifications
  const specs = [...measurements];
  if (lower.includes('marine')) specs.push('Marine Grade (water-resistant adhesive)');
  if (lower.includes('exterior')) specs.push('Exterior Grade');
  if (lower.includes('interior')) specs.push('Interior Grade');
  if (lower.includes('stainless')) specs.push('Corrosion-resistant Stainless Finish');
  if (lower.includes('unlocked')) specs.push('Carrier Unlocked');
  if (lower.includes('5g')) specs.push('5G Cellular Connectivity');
  if (lower.includes('ergonomic')) specs.push('Ergonomic Adjustable Configuration');
  if (lower.includes('welded')) specs.push('Welded Construction');
  if (lower.includes('seamless')) specs.push('Seamless Construction');

  // 7. Clean normalized name
  // Remove filler words like "price", "cost", "in nigeria", "near me" from the core product name
  let normalizedName = cleaned
    .replace(/\b(price|cost|prices|rates?|in\s+[a-z\s]+|for\s+sale|buy|where\s+to\s+buy|near\s+me)\b/gi, '')
    .trim();
  if (!normalizedName) {
    normalizedName = cleaned;
  }
  // Capitalize first letter of words
  normalizedName = normalizedName
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // 8. Generate targeted commercial search queries
  const searchQueries: string[] = [
    `${normalizedName} price quote`,
    `${normalizedName} distributor supplier catalog`,
    `${normalizedName} specification sheet cost`,
  ];

  // If a location is mentioned (e.g. "Nigeria", "UK", "Canada"), incorporate it into search queries
  const locationMatch = cleaned.match(/\b(in|at|for)\s+([A-Za-z]+)\b/i);
  if (locationMatch && locationMatch[2]) {
    const loc = locationMatch[2];
    searchQueries.unshift(`${normalizedName} price in ${loc}`);
    searchQueries.push(`${normalizedName} suppliers ${loc}`);
  }

  // 9. Identify ambiguities / uncertainties
  const uncertainties: string[] = [];
  if (specs.length === 0) {
    uncertainties.push('Query does not specify dimensions, thickness, or size standard.');
  }
  if (!detectedBrand && (category.includes('Electronics') || category.includes('Furniture') || category.includes('Safety'))) {
    uncertainties.push('No specific manufacturer or brand specified; market pricing spans multiple market tiers.');
  }
  if (!detectedMaterial && category.includes('Building')) {
    uncertainties.push('Specific sub-material or wood species not identified.');
  }

  return {
    name: normalizedName,
    category,
    description: `Standard market catalog specification for ${normalizedName}, classified under ${category}.`,
    brand: detectedBrand,
    model: detectedModel,
    material: detectedMaterial,
    specifications: specs,
    possible_variants: [
      `${normalizedName} Standard Commercial Grade`,
      `${normalizedName} Heavy-Duty / Premium Grade`,
    ],
    search_queries: Array.from(new Set(searchQueries)),
    confidence: specs.length > 0 ? 0.85 : 0.65,
    uncertainties,
  };
}
