import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import path from "path";

// Path to your GCS service account JSON file
const GCS_KEYFILE = process.env.GCS_KEYFILE_PATH;
const GCS_BUCKET = "bucket6207"; // Replace with your GCS bucket name

const storage = new Storage({ keyFilename: GCS_KEYFILE });
const bucket = storage.bucket(GCS_BUCKET);

async function uploadToGCS(fileBuffer, fileName) {
  try {
    // Use sharp to compress and resize the image (optional resizing)
    const compressedBuffer = await sharp(fileBuffer)
      .resize({ width: 800 }) // Resize to a max width (optional, adjust as needed)
      .webp({ quality: 75 }) // Compress the image in WebP format with quality 75 (adjust as needed)
      .toBuffer();

    // Use sharp to detect the image format and metadata
    const metadata = await sharp(compressedBuffer).metadata();
    const contentType = metadata.format
      ? `image/${metadata.format}`
      : "application/octet-stream"; // Default to binary if format is unknown

    // Create a reference to the GCS file
    const file = bucket.file(fileName);

    // Upload the compressed image buffer to GCS with the dynamic content type
    await file.save(compressedBuffer, {
      metadata: { contentType },
    });

    // Return the public URL of the uploaded image (including file name)
    const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error("Error during image upload:", error.message);
    throw error;
  }
}

export default { uploadToGCS };
