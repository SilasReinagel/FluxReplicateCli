// @ts-check
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAndProcessImages } from './imageGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function startServer(port) {
  const app = express();
  app.use(express.json());
  app.use(express.static('public'));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.post('/generate', async (req, res) => {
    const { prompt, model, numImages } = req.body;
    try {
      const imageUrls = await generateAndProcessImages(prompt, model, numImages, false);
      res.json({ imageUrls });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}