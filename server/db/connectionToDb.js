import { connect } from "mongoose";

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

/**
 * Function to check database connection
 */
const checkDatabaseConnection = async () => {
  try {
    const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/myapp";

    // Attempt to connect to the database
    await connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected successfully");
    return true; // Return true if connected
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false; // Return false if connection fails
  }
};

export default checkDatabaseConnection;
