// @ts-check
import { getFluxProImageUrl, getFluxSchnellImageUrl } from './flux.js';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { exec } from 'child_process';
import https from 'https';

// Function to download the image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
          resolve(filepath);
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

// Function to open the image with the default app
const openImage = (filepath) => {
  const command = process.platform === 'win32' ? 'start' :
                  process.platform === 'darwin' ? 'open' : 'xdg-open';
  
  exec(`${command} ${filepath}`, (error) => {
    if (error) {
      console.error(`Error opening image: ${error}`);
    }
  });
};

export async function generateAndProcessImages(prompt, model, numImages, saveLocally = true) {
  if (saveLocally) {
    await fsPromises.mkdir('./_images', { recursive: true });
  }

  const getImageUrl = model === 'pro' ? getFluxProImageUrl : getFluxSchnellImageUrl;

  const imagePromises = Array.from({ length: numImages }, async () => {
    try {
      const output = await getImageUrl(prompt);
      const imageUrl = Array.isArray(output) ? output[0] : output;

      const urlParts = new URL(imageUrl).pathname.split('/');
      const imageId = urlParts[urlParts.length - 2];
      const originalFilename = urlParts[urlParts.length - 1];
      const filename = `${imageId}_${originalFilename}`;

      if (saveLocally) {
        const filepath = `./_images/${filename}`;
        await downloadImage(imageUrl, filepath);
        console.log(`Image saved to: ${filepath}`);
        openImage(filepath);
      }

      return imageUrl;
    } catch (error) {
      console.error(`Error processing image: ${error}`);
      return null;
    }
  });

  return (await Promise.all(imagePromises)).filter(Boolean);
}