// @ts-check
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})

export async function getFluxProImageUrl(prompt) {
  const output = await replicate.run(
    "black-forest-labs/flux-pro",
    {
      input: {
        prompt: prompt,
      },
    }
  );
  return output;
}

export async function getFluxSchnellImageUrl(prompt) {
  const output = await replicate.run(
    "black-forest-labs/flux-schnell",
    {
      input: {
        prompt: prompt,
      },
    }
  );
  return output;
}