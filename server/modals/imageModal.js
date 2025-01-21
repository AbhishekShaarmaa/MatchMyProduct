import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileDes: {
      type: String,
      required: true,
    },
    metaData: {
      type: String,
      required: false,
    },
    publicUrl: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
