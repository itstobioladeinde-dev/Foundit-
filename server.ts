import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { searchProduct, SearchValidationError } from './server/searchProduct.ts';
import { understandProductQuery } from './server/services/queryUnderstandingService.ts';
import { researchProduct } from './server/research/researchProduct.ts';
import { estimateMarketPrice } from './server/pricing/pricingEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // JSON Body Parser with safe size boundary
  app.use(express.json({ limit: '100kb' }));

  // Global JSON syntax error catcher
  app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'status' in err && (err as { status?: number }).status === 400) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON payload received.',
      });
    }
    next(err);
  });

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'MarketProbe API',
      timestamp: new Date().toISOString(),
    });
  });

  // Search API Route
  app.post('/api/search', async (req, res) => {
    try {
      const { query } = req.body || {};
      const data = await searchProduct(query);
      res.json({
        success: true,
        data,
      });
    } catch (err: unknown) {
      if (err instanceof SearchValidationError) {
        res.status(err.statusCode).json({
          success: false,
          error: err.message,
        });
      } else {
        const message = err instanceof Error ? err.message : 'Internal server error occurred.';
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    }
  });

  // Dedicated AI Query Understanding Endpoint
  app.post('/api/understand-query', async (req, res) => {
    try {
      const { query } = req.body || {};
      if (typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Search query cannot be empty. Please provide a product or material text string.',
        });
      }
      if (query.trim().length > 200) {
        return res.status(400).json({
          success: false,
          error: 'Search query exceeds maximum limit of 200 characters.',
        });
      }
      const data = await understandProductQuery(query);
      res.json({
        success: true,
        data,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to analyze product query.';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  });

  // Dedicated Product Web Research Layer Endpoint
  app.post('/api/research', async (req, res) => {
    try {
      const { query, interpretation } = req.body || {};

      let parsedInterpretation = interpretation;
      if (!parsedInterpretation) {
        if (typeof query !== 'string' || !query.trim()) {
          return res.status(400).json({
            success: false,
            error: 'Either query text or a structured interpretation is required.',
          });
        }
        parsedInterpretation = await understandProductQuery(query);
      }

      const researchData = await researchProduct(parsedInterpretation);
      res.json({
        success: true,
        data: researchData,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Web research stage failed.';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  });

  // Dedicated Pricing Intelligence Layer Endpoint
  app.post('/api/pricing', async (req, res) => {
    try {
      const { records, interpretation, query, currency } = req.body || {};

      let parsedInterpretation = interpretation;
      if (!parsedInterpretation) {
        if (typeof query !== 'string' || !query.trim()) {
          return res.status(400).json({
            success: false,
            error: 'Either query text or a structured interpretation is required.',
          });
        }
        parsedInterpretation = await understandProductQuery(query);
      }

      let researchRecords = records;
      if (!Array.isArray(researchRecords)) {
        const researchData = await researchProduct(parsedInterpretation);
        researchRecords = researchData.records;
      }

      const pricingResult = estimateMarketPrice(researchRecords, parsedInterpretation, currency);
      res.json({
        success: true,
        data: pricingResult,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Pricing intelligence calculation failed.';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  });

  // Dev mode: Mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static client
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[MarketProbe] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[MarketProbe] Failed to start server:', err);
  process.exit(1);
});
