import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import identificationRoutes from "./routes/identificationRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const backendDirectory = path.dirname(fileURLToPath(import.meta.url));

// Static assets under /assets (e.g. the local plant-image fallback) are
// meant to be embedded by the frontend, which runs on a different origin -
// helmet's default same-origin Cross-Origin-Resource-Policy would otherwise
// have the browser block those <img> loads.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
const configuredFrontendUrl = process.env.FRONTEND_URL;
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = new Set([
  configuredFrontendUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(
  cors({
    // Outside production, allow any origin - during local dev the frontend
    // can be reached from several equivalent origins (localhost vs 127.0.0.1,
    // a LAN IP, an alternate Vite port), and locking those down here only
    // trades dev convenience for no real security benefit.
    origin: (origin, callback) => {
      if (!isProduction || !origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      console.warn(`[cors] Rejected origin: ${origin}`);
      return callback(new Error("Origin is not allowed by CORS."));
    },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/assets", express.static(path.join(backendDirectory, "../public")));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "FloraFind API is running." });
});

app.use("/api/identify", identificationRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
