import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
  },
  { _id: false }
);

const bilingualCareGuideSchema = new mongoose.Schema(
  {
    sunlight_en: String,
    sunlight_hi: String,
    watering_en: String,
    watering_hi: String,
    soil_en: String,
    soil_hi: String,
    temperature_en: String,
    temperature_hi: String,
  },
  { _id: false }
);

// Preserves the plant -> plant part -> traditional use relationship from
// IMPPAT (translated/rephrased by the AI, never invented by it).
const traditionalUseSchema = new mongoose.Schema(
  {
    plantPart: String,
    uses_en: { type: [String], default: [] },
    uses_hi: { type: [String], default: [] },
  },
  { _id: false }
);

// AI-identified product TYPE (never a brand/link/price) with a conservative
// claim-vs-evidence assessment, linked back to the plant part it is
// typically derived from where reasonably known.
const marketProductSchema = new mongoose.Schema(
  {
    productType: String,
    productType_hi: String,
    plantPart: String,
    claim_en: String,
    claim_hi: String,
    scientificAssessment_en: String,
    scientificAssessment_hi: String,
    evidenceLevel: {
      type: String,
      enum: [
        "Strong evidence",
        "Moderate evidence",
        "Limited evidence",
        "Insufficient evidence",
        "Unclear",
      ],
      default: "Unclear",
    },
  },
  { _id: false }
);

const plantSchema = new mongoose.Schema(
  {
    commonName: { type: String, trim: true },
    scientificName: { type: String, trim: true },
    family: { type: String, trim: true },
    genus: { type: String, trim: true },
    species: { type: String, trim: true },

    // Normalized lookup keys so "Neem", "neem", "Azadirachta indica" resolve
    // to the same cached document.
    normalizedNames: { type: [String], index: true },

    images: { type: [String], default: [] },
    imagesFetchedAt: { type: Date },

    generalInfo: {
      description_en: String,
      description_hi: String,
    },

    traditionalMedicinalUses: { type: [traditionalUseSchema], default: [] },
    imppatFetchedAt: { type: Date },
    marketProducts: { type: [marketProductSchema], default: [] },
    aiProcessedAt: { type: Date },

    careGuide: bilingualCareGuideSchema,

    sources: { type: [sourceSchema], default: [] },
    warnings: { type: [String], default: [] },
  },
  { timestamps: true }
);

plantSchema.index({ scientificName: 1 });

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;
