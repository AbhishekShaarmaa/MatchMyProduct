import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import multer from "multer";
import cors from "cors";
import checkDatabaseConnection from "./db/connectionToDb.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Routes
import imageRoutes from "./routes/imageRoutes.js";

const PORT = process.env.PORT || 5001;

//routes
app.use("/api/image", imageRoutes);

// const checkDatabaseConnection = async () => {
//   try {
//     const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/myapp";

//     // Attempt to connect to the database
//     await connect(dbUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("✅ Database connected successfully");
//     return true; // Return true if connected
//   } catch (error) {
//     console.error("❌ Database connection failed:", error.message);
//     return false; // Return false if connection fails
//   }
// };

app.listen(PORT, () => {
  checkDatabaseConnection();
  console.log(`server running on port ${PORT}`);
});
