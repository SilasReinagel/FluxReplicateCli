// @ts-check
import { generateAndProcessImages } from './imageGenerator.js';

// Parse command line arguments
const args = process.argv.slice(2);
const prompt = args[0];
const model = args[1] === 'pro' || args[1] === 'schnell' ? args[1] : 'schnell';
const numImages = parseInt(args[2]) || 1;

if (!prompt) {
  console.error('Please provide a prompt as the first argument.');
  process.exit(1);
}

try {
  await generateAndProcessImages(prompt, model, numImages);
} catch (error) {
  console.error('Error generating images:', error);
}
