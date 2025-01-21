import sharp from "sharp";

// Mock Embedding Generator (Replace with a real embedding model like CLIP)
async function generateEmbedding(imagePath) {
  // Generate a 512-dimension random vector
  return Array(512).fill(Math.random());
}

// Extract Image Metadata
async function extractMetadata(imagePath) {
  const metadata = await sharp(imagePath).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: metadata.size,
  };
}

export default { generateEmbedding, extractMetadata };
