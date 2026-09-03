import mongoose from "mongoose";

// Tracks whether Mongo is actually usable so the rest of the app can
// degrade gracefully (cache reads/writes are skipped) instead of crashing
// when no MONGODB_URI is configured or the cluster is unreachable.
let isConnected = false;

export const isDbConnected = () => isConnected;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "[db] MONGODB_URI not set - starting without a database. Plant data will be fetched live and not cached."
    );
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || "florafind",
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log("[db] MongoDB connected");

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("[db] MongoDB disconnected");
    });
  } catch (err) {
    isConnected = false;
    console.error(`[db] MongoDB connection failed: ${err.message}`);
    console.warn("[db] Continuing without a database - caching disabled.");
  }
};

export default connectDB;
