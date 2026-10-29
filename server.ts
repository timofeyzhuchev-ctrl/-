import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { processArgusImage } from './src/server/geminiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // 50mb limit for high resolution base64 surveillance photos
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.post('/api/analyze', async (req, res) => {
    try {
      const { image, mimeType, searchMode, registeredCandidates } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Изображение не предоставлено' });
      }

      const result = await processArgusImage(
        image,
        mimeType || 'image/jpeg',
        searchMode === 'standard' ? 'standard' : 'database',
        registeredCandidates
      );
      return res.json(result);
    } catch (err: any) {
      console.error('Error in /api/analyze:', err);
      return res.status(500).json({ 
        error: err.message || 'Ошибка обработки изображения нейросетью' 
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'active',
      name: 'ARGUS_SAFE_CITY_AI',
      version: '3.4-PDN',
      geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Direct download endpoint for GitHub/Render upload archive (with cache busting)
  app.get(['/download/argus-ai.zip', '/download/argus-ai-v3.zip'], (_req, res) => {
    const zipPath = path.resolve(__dirname, 'public/assets/aistudio/argus-ai-v3.zip');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.download(zipPath, 'argus-ai-v3.zip');
  });

  // Development with Vite middlewares or production static serve
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? { server: httpServer } : false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[ARGUS-AI] Сервер запущен на http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ARGUS-AI] Критическая ошибка запуска сервера:', err);
});
