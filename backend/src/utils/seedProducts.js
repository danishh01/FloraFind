// Development seed data - the same 8 products the Shop used to ship
// hardcoded on the frontend, now inserted into MongoDB so /api/products
// has something real to serve. Run with `npm run seed`. Images are
// frontend-relative paths (served by the Vite dev server / static host),
// not backend URLs.
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "../models/Product.js";

const products = [
  {
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    category: "indoor",
    image: "/indoor.png",
    price: 499,
    rating: 4.8,
    reviews: 126,
    inStock: true,
    benefits: [
      "Purifies indoor air",
      "Very low maintenance",
      "Perfect for beginners",
      "Ideal for homes and offices",
    ],
  },
  {
    name: "Peace Lily",
    scientificName: "Spathiphyllum",
    category: "indoor",
    image: "/indoor.png",
    price: 699,
    rating: 4.7,
    reviews: 94,
    inStock: true,
    benefits: [
      "Produces elegant white flowers",
      "Improves indoor air quality",
      "Adds beauty to interiors",
      "Easy to care for",
    ],
  },
  {
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    category: "indoor",
    image: "/indoor.png",
    price: 999,
    rating: 4.9,
    reviews: 201,
    inStock: false,
    benefits: [
      "Beautiful split leaves",
      "Creates a tropical look",
      "Fast-growing indoor plant",
      "Excellent decorative plant",
    ],
  },
  {
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis Miller",
    category: "indoor",
    image: "/indoor.png",
    price: 299,
    rating: 4.6,
    reviews: 158,
    inStock: true,
    benefits: [
      "Known for medicinal uses",
      "Easy to maintain",
      "Requires little water",
      "Suitable for sunny spaces",
    ],
  },
  {
    name: "Rose Plant",
    scientificName: "Rosa",
    category: "outdoor",
    image: "/outdoor.png",
    price: 399,
    rating: 4.5,
    reviews: 87,
    inStock: true,
    benefits: [
      "Beautiful flowering plant",
      "Enhances garden appearance",
      "Available in many colors",
      "Pleasant fragrance",
    ],
  },
  {
    name: "Hibiscus",
    scientificName: "Hibiscus rosa-sinensis",
    category: "outdoor",
    image: "/outdoor.png",
    price: 349,
    rating: 4.4,
    reviews: 63,
    inStock: true,
    benefits: [
      "Large colorful flowers",
      "Attracts butterflies",
      "Easy to grow",
      "Long flowering season",
    ],
  },
  {
    name: "Organic Compost",
    scientificName: "Organic Fertilizer",
    category: "seeds-fertilizers",
    image: "/seedsandfertilizers.png",
    price: 249,
    rating: 4.8,
    reviews: 143,
    inStock: true,
    benefits: [
      "Improves soil fertility",
      "Promotes healthy plant growth",
      "100% Organic",
      "Suitable for all plants",
    ],
  },
  {
    name: "Ceramic Pot",
    scientificName: "Decorative Planter",
    category: "pots-accessories",
    image: "/potsandacc.png",
    price: 599,
    rating: 4.7,
    reviews: 55,
    inStock: false,
    benefits: [
      "Premium ceramic finish",
      "Modern decorative design",
      "Durable construction",
      "Suitable for indoor plants",
    ],
  },
];

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("[seed] MONGODB_URI is not set - cannot seed products.");
    process.exitCode = 1;
    return;
  }

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "florafind" });

  const existingCount = await Product.countDocuments();
  if (existingCount > 0) {
    console.log(`[seed] Products collection already has ${existingCount} document(s) - skipping.`);
  } else {
    await Product.insertMany(products);
    console.log(`[seed] Inserted ${products.length} products.`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("[seed] Failed:", err.message);
  process.exitCode = 1;
});
