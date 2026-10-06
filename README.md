# MarketProbe — AI Physical Product & Price Intelligence

> **Production Deployment & Architecture Manual**  
> *Text-Search-Only Engine for Commercial Product Discovery & Verified Price Intelligence*

---

## 1. Project Overview

**MarketProbe** is an enterprise-grade market intelligence engine engineered to help procurement teams, estimators, contractors, and businesses research physical goods, building materials, commercial hardware, safety PPE, and electronic devices.

Unlike typical conversational AI or web aggregators, MarketProbe enforces **evidence-backed pricing integrity**:
- **Text-Search-Only**: Accepts natural-language text queries (e.g., `"12mm marine plywood price in Nigeria"`, `"stainless steel pipe 2 inch Schedule 40"`).
- **Zero Image Hallucination**: Contains **no** image-upload, camera, or image-recognition features—eliminating perceptual bias and focusing solely on verifiable procurement catalog specifications.
- **Strictly Grounded Facts**: Never fabricates prices. If an item requires custom RFQs or private trade agreements, MarketProbe transparently reports a "Price Currently Unavailable" state rather than guessing.
- **Untrusted Web Isolation**: Treats all external web snippets as untrusted data, defending against indirect prompt injection and SSRF attacks.
- **Relational Persistence**: Stores every search, query interpretation, research citation, price observation, and final calculated benchmark in an indexed relational database.

---

## 2. Technology Stack

- **Frontend**: React 19 SPA, Tailwind CSS v4, Lucide Icons, Accessible HTML5 / ARIA.
- **Backend / API**: Node.js & TypeScript, Express server running on port 3000.
- **AI Query Engine**: Google Gemini 3.8 Flash (`@google/genai` TypeScript SDK) utilizing structured JSON Schema enforcement.
- **Search Provider Layer**: Google Search Grounding with pluggable fallback catalog providers.
- **Database**: Relational indexed document store (`.data/marketprobe_db.json`) supporting O(1) hash lookups, foreign-key relationships, and atomic file flush.
- **Security & Networking**: Rate limiting (token bucket / IP window), defensive HTTP security headers (`nosniff`, `SAMEORIGIN`), SSRF private-IP blacklisting, and in-flight request cancellation.

---

## 3. Local Development Setup

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation & Startup

1. **Clone and Install Dependencies**:
   ```bash
   git clone <repository-url>
   cd marketprobe
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your Gemini API key (optional for local testing; fallback provider runs automatically if unset):
   ```bash
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   NODE_ENV="development"
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Execute Automated Test Suites**:
   ```bash
   npm run test
   ```
   Runs both the Pricing Engine (7 tests) and Relational Database (8 tests) validation suites.

---

## 4. Environment Variables

All secrets remain strictly server-side. No client-side `VITE_` variables are required for API credentials.

| Variable | Required | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Recommended | `""` | Authorizes server-side calls to Gemini 3.8 Flash for query interpretation and live search grounding. In AI Studio, injected automatically from user secrets. |
| `PORT` | Optional | `3000` | Local or container port for the Express application. |
| `NODE_ENV` | Optional | `production` | Sets Node.js environment mode (`production` serves pre-built assets from `dist/`; `development` mounts Vite dev middleware). |
| `APP_URL` | Optional | Self-resolved | Canonical base URL used for OpenGraph cards and link resolution in cloud environments. |

---

## 5. Database Setup & Architecture

MarketProbe uses a file-backed relational persistence engine with ACID guarantees located in `.data/marketprobe_db.json`.

### Relational Schema Hierarchy
```
Searches (Parent)
  ├── Query Interpretations (1-to-1 via search_id)
  ├── Research Sources (1-to-many via search_id)
  ├── Price Observations (1-to-many via search_id)
  └── Final Search Results (1-to-1 via search_id)
```

### Key Database Tables
1. `searches`: Primary parent records holding UUID, user query, status (`pending`, `completed`, `failed`), and timestamps.
2. `query_interpretations`: Stores parsed taxonomy, specifications, detected materials, and generated research queries.
3. `research_sources`: Normalized merchant/distributor records preserving title, source URL, seller, price, and specs.
4. `price_observations`: Mathematical pricing quotes preserving original and normalized currencies, match category, and outlier tags.
5. `final_search_results`: The final calculated benchmark, floor, ceiling, methodology, and limitations.

### Migrations & Durability
- **Self-Initializing**: Automatically provisions the `.data/` directory and creates initial indexes on first boot.
- **Atomic Writes**: Persists updates by writing to an ephemeral temp file before performing an atomic OS rename (`fs.renameSync`), eliminating write corruption.
- **Memory Safeguards**: Includes in-memory LRU indexing for $O(1)$ query retrieval by UUID or normalized query string.

---

## 6. AI Configuration

- **Model Selection**: `gemini-3.8-flash` via the `@google/genai` TypeScript SDK.
- **Server Isolation**: Invoked strictly in `server/services/queryUnderstandingService.ts`. The API key is never bundled in frontend JavaScript.
- **Strict JSON Schema**: AI responses are generated via native schema enforcement (`responseMimeType: "application/json"`) and strictly validated at runtime using `validateProductQueryInterpretation`.
- **Prompt Injection Defense**: Untrusted text from external web pages is delimited, sanitised, and stripped of directive markers before ingestion.

---

## 7. Search Provider Configuration

MarketProbe decouples search collection logic behind the `WebResearchProvider` interface (`server/research/providers/types.ts`):
```typescript
export interface WebResearchProvider {
  readonly id: string;
  readonly name: string;
  research(interpretation: ProductQueryInterpretation): Promise<ProductResearchRecord[]>;
}
```

### Available Providers
- **`GeminiSearchProvider`**: Uses Gemini 3.8 Flash with `googleSearch` grounding tools to discover live merchant pages.
- **`FallbackResearchProvider`**: Offline catalog provider used during network isolation or when `GEMINI_API_KEY` is not present, guaranteeing high-availability testing and development.
- **Swapping Providers**: New enterprise aggregators (e.g., Serper, SerpAPI, custom crawlers) can be attached via `setWebResearchProvider(...)` without modifying any route or UI components.

---

## 8. Deployment Instructions

### Cloud Run / AI Studio Deployment
1. **Build Artifacts**:
   ```bash
   npm run build
   ```
   Compiles frontend assets into `dist/` and validates TypeScript typing (`tsc --noEmit`).
2. **Start Production Server**:
   ```bash
   npm run start
   ```
   Launches the Express full-stack server on port 3000, serving the static frontend from `dist/` and handling `/api/*` routes.
3. **Container Environment**:
   - Set container port to `3000`.
   - Ensure read/write access to `.data/` for search persistence.
   - Configure `GEMINI_API_KEY` in environment secrets.

### Domain Configuration & HTTPS
- Always terminate TLS/HTTPS at the load balancer or cloud proxy.
- Express runs behind reverse proxies with standard `X-Forwarded-For` and `X-Forwarded-Proto` forwarding enabled.
- Security headers enforce `X-Content-Type-Options: nosniff` and `SAMEORIGIN` frame restrictions.

---

## 9. Troubleshooting

| Symptom | Probable Cause | Recommended Resolution |
| :--- | :--- | :--- |
| **HTTP 429 Too Many Requests** | Client exceeded 30 queries per minute | Wait for the `Retry-After` window or increase `MAX_REQUESTS_PER_WINDOW` in `server/middleware/security.ts`. |
| **Price Unavailable State** | Product is an industrial custom order or lacks public online catalog prices | Verified behavior; request formal supplier quote or RFQ. |
| **Fallback Notice in Logs** | `GEMINI_API_KEY` is not set or rate-limited | Add key to `.env` or Secrets panel; the heuristic fallback will ensure zero crashes in the meantime. |
| **Cached Result Returned** | Identical query submitted within 30 minutes | Expected behavior for cost control. Results serve in $<10$ms. Clear `.data/marketprobe_db.json` if fresh retrieval is desired. |

---

## 10. Known Limitations

1. **Wholesale / Heavy Construction RFQs**: Large-scale building materials (structural beams, gravel bulk haulage) rarely feature public transactional checkouts; MarketProbe displays the honest "Price Unavailable" state for these items.
2. **Real-time Foreign Exchange**: Cross-currency normalization uses reference mid-market exchange rates. Real-time sub-second FX feeds can be plugged into `currencyConverter.ts` for financial trading use cases.
3. **Local Delivery Freight**: Heavy freight delivery fees vary by job-site mileage and are clearly noted as exclusions in the pricing disclaimer.

---

## 11. Confirmation of Text-Search Scope

> **Confirmation**: MarketProbe is strictly a **TEXT-SEARCH-ONLY** product intelligence tool.  
> It contains **zero** image upload components, drag-and-drop file targets, webcam integrations, or visual recognition APIs.
