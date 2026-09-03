import mongoose from "mongoose";

// Lightweight log of identification requests for analytics/debugging.
// Never stores the uploaded image itself.
const identificationSchema = new mongoose.Schema(
  {
    topMatch: {
      scientificName: String,
      commonName: String,
      score: Number,
    },
    matchCount: Number,
    success: Boolean,
    errorMessage: String,
  },
  { timestamps: true }
);

const Identification = mongoose.model("Identification", identificationSchema);

export default Identification;
