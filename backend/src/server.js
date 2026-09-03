import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] FloraFind API listening on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("[server] Startup failed:", err.message);
  process.exitCode = 1;
});
