import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { searchProduct, SearchValidationError } from './server/searchProduct.ts';

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
