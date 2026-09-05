import Plant from "../models/Plant.js";
import { isDbConnected } from "../config/db.js";
import normalizePlantName from "../utils/normalizePlantName.js";
import deduplicateBy from "../utils/deduplicate.js";
import imppatService from "./imppatService.js";
import aiService from "./aiService.js";
import iNaturalistService from "./iNaturalistService.js";
import imagekitService from "./imagekitService.js";

const titleCase = (s) =>
  s
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const looksBinomial = (s) => /^[a-z]+\s[a-z-]+$/i.test((s || "").trim());

// Fetches real photos from iNaturalist, then uploads each one to ImageKit so
// later visitors get a smaller, faster-loading copy instead of always
// depending on iNaturalist's own image server. The 3 uploads run at the same
// time since they don't depend on each other. If ImageKit isn't configured
// (or one particular upload fails), that image just falls back to its
// original iNaturalist URL - a plant lookup never breaks because of this.
const fetchAndUploadImages = async (scientificName) => {
  const result = await iNaturalistService.getPlantImages(scientificName);
  if (result.images.length === 0) return result;

  const fileNamePrefix = normalizePlantName(scientificName).replace(/\s+/g, "-") || "plant";
  const images = await Promise.all(
    result.images.map(async (rawUrl, index) => {
      const optimizedUrl = await imagekitService.uploadPlantImage(
        rawUrl,
        `${fileNamePrefix}-${index + 1}.jpg`
      );
      return optimizedUrl || rawUrl;
    })
  );

  return { ...result, images };
};

const emptyCareGuide = () => ({
  sunlight_en: null,
  sunlight_hi: null,
  watering_en: null,
  watering_hi: null,
  soil_en: null,
  soil_hi: null,
  temperature_en: null,
  temperature_hi: null,
});

/**
 * Fetches (or builds and persists) the unified plant detail record consumed
 * by GET /api/plants/search and GET /api/plants/:plantName. MongoDB is the
 * only persistence/lookup layer - a valid existing record is returned as-is
 * (no automatic expiration); to force a rebuild, delete the record.
 *
 * Flow: a scientific name is resolved (from hints or the query itself),
 * then iNaturalist (images) + IMPPAT (plant-part traditional uses) are
 * fetched as real data. That real IMPPAT data - never
 * anything else - plus the plant's identification (name/scientific
 * name/family) is handed to the AI, which (a) writes a description and Hindi translations
 * from its own knowledge, (b) translates the IMPPAT terms, and (c)
 * separately uses its own general knowledge to identify market product
 * TYPES for this plant and give a conservative claim/evidence assessment.
 *
 * query: the user's search text or a scientific name from a PlantNet match.
 * hints: optional { commonName, family, genus, scientificName } already
 *        known from a prior step (e.g. a PlantNet identification result).
 */
export const getOrBuildPlant = async (query, hints = {}) => {
  const normalized = normalizePlantName(query);
  if (!normalized) {
    const err = new Error("A plant name is required.");
    err.statusCode = 400;
    throw err;
  }

  const dbReady = isDbConnected();
  let cached = null;

  if (dbReady) {
    cached = await Plant.findOne({
      normalizedNames: normalized,
    }).lean();

    // A record cached before Wikipedia was removed can carry a Wikipedia
    // source entry and a Wikipedia-derived description - that's real text,
    // so the completeness checks below would otherwise treat it as "done"
    // forever. Force those to be rebuilt under the current AI-only
    // pipeline instead.
    const isStaleWikipediaRecord = cached?.sources?.some((s) => s.name === "Wikipedia");

    if (cached && !isStaleWikipediaRecord) {
      // aiProcessedAt is set whether or not the AI call actually succeeded,
      // so on its own it can't prove the AI content is usable - a plant
      // whose first fetch hit a transient AI failure would otherwise stay
      // saved with empty careGuide/marketProducts/Hindi text indefinitely
      // (MongoDB records don't expire). Require that no AI-failure warning
      // was recorded, and that a real description exists.
      const aiSucceeded =
        !cached.warnings?.some((w) => w.includes("AI-generated")) &&
        !!cached.generalInfo?.description_en;
      const hasFullAiData =
        cached.imagesFetchedAt && cached.aiProcessedAt && aiSucceeded && cached.marketProducts?.length > 0;
      const hasLegacyImages = cached.images?.length >= 3 && cached.marketProducts?.length > 0;
      const isComplete =
        (cached.imppatFetchedAt && (hasFullAiData || hasLegacyImages)) || !cached.scientificName;

      if (isComplete) {
        const plant =
          cached.images?.length > 3 ? { ...cached, images: cached.images.slice(0, 3) } : cached;
        return { plant, fromCache: true, warnings: cached.warnings || [] };
      }
    }
  }

  const warnings = [];

  // Resolve a scientific name up front - IMPPAT, iNaturalist images, and
  // the AI description all work best (or only work) with a real binomial
  // name.
  // Prefer an explicit hint, then a query that already looks binomial.
  // A plain, non-binomial common-name query with no hint (rare in the real
  // PlantNet -> PossibleMatches -> PlantDetails flow, which always supplies
  // one or the other) is left unresolved rather than guessed - downstream
  // services already treat a missing scientific name as "no data" and
  // degrade gracefully.
  const scientificName =
    hints.scientificName || (looksBinomial(query) ? titleCase(query) : null);

  // If this plant already has real images stored from an earlier attempt
  // (e.g. only the AI step needed a retry), reuse them as-is instead of
  // re-fetching from iNaturalist and re-uploading to ImageKit for no reason
  // - the photos themselves didn't change just because another part of the
  // record needs rebuilding.
  const cachedImages = cached?.images?.length ? cached.images : null;
  const cachedImageSource = cached?.sources?.find((s) => s.name === "iNaturalist") || null;

  // IMPPAT and iNaturalist/ImageKit don't depend on each other's results, so
  // they run at the same time instead of one after another. The AI call
  // right after this only needs `traditional` (never the images), so it's
  // still safe to keep it sequential and start it once both are done.
  // getTraditionalUses never throws - on any failure it resolves to
  // { available: false, reason } - so no try/catch is needed here.
  const [traditional, imageResult] = await Promise.all([
    imppatService.getTraditionalUses(scientificName),
    cachedImages
      ? Promise.resolve({ images: cachedImages, source: cachedImageSource })
      : fetchAndUploadImages(scientificName),
  ]);
  if (!traditional.available) {
    warnings.push("Traditional/medicinal use information is temporarily unavailable.");
  }
  const imppatFetchedAt = new Date();
  const imagesFetchedAt = new Date();

  const queryMatchesScientific =
    scientificName && normalizePlantName(scientificName) === normalized;

  const commonName =
    hints.commonName || (queryMatchesScientific ? null : titleCase(query.trim()));

  const [genus, species] = scientificName ? scientificName.split(" ") : [null, null];

  const images = imageResult.images;

  let ai = null;
  const aiProcessedAt = new Date();
  try {
    ai = await aiService.generatePlantContent({
      plantName: commonName || scientificName || query,
      scientificName,
      family: hints.family || null,
      genus: hints.genus || genus || null,
      species: species || null,
      traditionalUses: traditional.available
        ? traditional.parts.map((p) => ({ plantPart: p.plantPart, uses: p.uses }))
        : [],
    });
  } catch (error) {
    console.warn(`[plantAggregatorService] AI content unavailable: ${error.message}`);
    warnings.push("AI-generated summaries and Hindi translations are temporarily unavailable.");
  }

  if (ai && (!Array.isArray(ai.marketProducts) || ai.marketProducts.length === 0)) {
    warnings.push("Market product and evidence information is temporarily unavailable.");
  }

  const sources = [];
  if (traditional.available && traditional.source) sources.push(traditional.source);
  if (imageResult.source) sources.push(imageResult.source);

  const marketProducts = deduplicateBy(
    ai?.marketProducts || [],
    (p) => `${p.productType}|${p.plantPart}`.toLowerCase()
  );

  const plant = {
    commonName: commonName || null,
    scientificName: scientificName || null,
    family: hints.family || null,
    genus: hints.genus || genus || null,
    species: species || null,
    normalizedNames: deduplicateBy(
      [normalized, normalizePlantName(scientificName), normalizePlantName(commonName)].filter(
        Boolean
      ),
      (n) => n
    ),
    images,
    imagesFetchedAt,
    generalInfo: {
      description_en: ai?.description_en ?? null,
      description_hi: ai?.description_hi ?? null,
    },
    // uses_en always comes straight from IMPPAT verbatim - the AI never
    // touches it. uses_hi is only overlaid when the AI actually returned a
    // Hindi translation for that exact plant part (see aiService's
    // length-validation) - otherwise it's [] and the frontend falls back to
    // showing the real English term for that bullet.
    traditionalMedicinalUses: traditional.available
      ? traditional.parts.map((p) => {
          const aiPart = ai?.traditionalMedicinalUses?.find((x) => x.plantPart === p.plantPart);
          return {
            plantPart: p.plantPart,
            uses_en: p.uses,
            uses_hi: aiPart?.uses_hi || [],
          };
        })
      : [],
    imppatFetchedAt,
    marketProducts,
    aiProcessedAt,
    careGuide: ai?.careGuide || emptyCareGuide(),
    sources,
    warnings,
  };

  if (dbReady) {
    try {
      await Plant.findOneAndUpdate(
        { normalizedNames: { $in: plant.normalizedNames } },
        plant,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (err) {
      console.warn(`[plantAggregatorService] Failed to save plant: ${err.message}`);
    }
  }

  return { plant, fromCache: false, warnings };
};

export default { getOrBuildPlant };
