// routes/imageRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { searchImage, uploadImage } from "../controller/imageController.js";
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Specify the uploads folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(
//       null,
//       `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
//     );
//   },
// });
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

// Route for uploading image (POST request)
router.post("/search", upload.single("image"), searchImage);
router.post("/upload", upload.single("image"), uploadImage);

export default router;
