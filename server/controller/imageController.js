import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import path from "path";
import gcs from "../utils/gcs.js";
import { extractProductDescription } from "../utils/ai.js";
import mongoose from "mongoose";
import Image from "../modals/imageModal.js";
import {
  storeProductInPinecone,
  productMatching,
} from "../modals/pineconeModel.js";

const count = 0;
export const searchImage = async (req, res) => {
  try {
    console.log("57", req);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("10", req.file);
    const originalName = req.file.originalname.split(".")[0]; // Extract the name part without the extension
    const fileExtension = path.extname(req.file.originalname); // Extract the file extension

    // Create a unique file name by appending the count value
    const uniqueFileName = `${originalName}-${count + 1}${fileExtension}`;
    console.log("Uploaded file:", uniqueFileName);
    const fileBuffer = req.file.buffer;

    console.log("20", fileBuffer);

    // Upload to GCS
    const publicUrl = await gcs.uploadToGCS(fileBuffer, uniqueFileName);
    console.log("26", publicUrl);
    // image description
    const imageDesc = await extractProductDescription(publicUrl);
    if (imageDesc == "The image does not contain any bag-related product.") {
      return res.status(200).json({
        message: "The image does not contain any bag-related product.",
      });
    }
    const newImage = new Image({
      fileName: uniqueFileName,
      originalName: originalName,
      fileDes: imageDesc,
      publicUrl: publicUrl,
    });
    // await newImage.save();
    const matchIds = await productMatching(newImage._id, imageDesc);

    const matchedObjects = await Image.find({ _id: { $in: matchIds } });

    return res.status(200).json({
      message: "Image uploaded and matches found successfully",

      matchedObjects: matchedObjects,
    });
  } catch (error) {
    console.error("Error during upload:", error);
    return res.status(500).json({ message: "Server error during file upload" });
  }
};

export const uploadImage = async (req, res) => {
  try {
    console.log("57", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("10", req.file);
    const originalName = req.file.originalname.split(".")[0]; // Extract the name part without the extension
    const fileExtension = path.extname(req.file.originalname); // Extract the file extension

    // Create a unique file name by appending the count value
    const uniqueFileName = `${originalName}-${count + 1}${fileExtension}`;
    console.log("Uploaded file:", uniqueFileName);
    const fileBuffer = req.file.buffer;

    console.log("20", fileBuffer);

    // Upload to GCS
    const publicUrl = await gcs.uploadToGCS(fileBuffer, uniqueFileName);
    console.log("26", publicUrl);
    // image description
    const imageDesc = await extractProductDescription(publicUrl);
    if (imageDesc == "The image does not contain any bag-related product.") {
      return res.status(200).json({
        message: "The image does not contain any bag-related product.",
      });
    }
    const newImage = new Image({
      fileName: uniqueFileName,
      originalName: originalName,
      fileDes: imageDesc,
      publicUrl: publicUrl,
    });
    await newImage.save();

    storeProductInPinecone(newImage._id, imageDesc);

    return res.status(200).json({
      message: "Image uploaded successfully",
      newImage: newImage,
    });
  } catch (error) {
    console.error("Error during upload:", error);
    return res.status(500).json({ message: "Server error during file upload" });
  }
};
