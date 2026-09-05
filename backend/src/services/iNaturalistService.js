import axios from "axios";

// Image source: iNaturalist (real, user-submitted observation photos - never
// a generic search image, never a swapped-in species just to hit a count).
//
// Two passes: first only "research grade" observations (community-confirmed
// ID), then "needs_id" (still the right species, just unconfirmed) to top up
// if research grade alone isn't enough. "casual" grade is skipped at both
// passes - too often missing a real ID. Fewer than 3 correct photos is fine;
// a wrong species never is.

const INAT_OBSERVATIONS_URL = "https://api.inaturalist.org/v1/observations";
const MAX_IMAGES = 3;

const normalizeName = (name) => (name || "").toLowerCase().trim();

const imageUrlFor = (photo) => {
  const sourceUrl = photo?.url;
  if (!sourceUrl) return null;
  try {
    const imageUrl = new URL(sourceUrl.replace("/square.", "/medium."));
    return imageUrl.protocol === "http:" || imageUrl.protocol === "https:"
      ? imageUrl.toString()
      : null;
  } catch {
    return null;
  }
};

// Picks up to `limit` distinct real photo URLs from a list of observations,
// at most one photo per observation (so one heavily-photographed
// observation can't crowd out the others), skipping any observation/photo
// that doesn't yield a usable URL.
const collectImages = (observations, limit, seenImages) => {
  const images = [];
  for (const observation of observations) {
    if (images.length >= limit) break;
    for (const photo of observation.photos || []) {
      const imageUrl = imageUrlFor(photo);
      if (imageUrl && !seenImages.has(imageUrl)) {
        seenImages.add(imageUrl);
        images.push(imageUrl);
        break;
      }
    }
  }
  return images;
};

/**
 * Fetches real iNaturalist photos for a scientific name (strict -> loose,
 * see file header). Doesn't throw on failure, same reasoning as
 * imppatService - an empty result here just means the caller falls back to
 * a local placeholder image.
 *
 * Returns { images: string[], source: {name,url}|null, strictCount: number,
 * looseCount: number } - source is only set when at least one real image
 * was found, for attribution.
 */
export const getPlantImages = async (scientificName, maxImages = MAX_IMAGES) => {
  if (!scientificName || scientificName.trim().split(/\s+/).length < 2) {
    return { images: [], source: null, strictCount: 0, looseCount: 0 };
  }

  try {
    const response = await axios.get(INAT_OBSERVATIONS_URL, {
      params: {
        taxon_name: scientificName,
        photos: true,
        quality_grade: "research,needs_id",
        per_page: 30,
        order_by: "votes",
        order: "desc",
      },
      headers: { Accept: "application/json" },
      timeout: 15000,
    });

    const matching = (response.data?.results || []).filter(
      (observation) => normalizeName(observation.taxon?.name) === normalizeName(scientificName)
    );
    const strictObservations = matching.filter((o) => o.quality_grade === "research");
    const looseObservations = matching.filter((o) => o.quality_grade === "needs_id");

    const seenImages = new Set();
    const strictImages = collectImages(strictObservations, maxImages, seenImages);
    const looseImages =
      strictImages.length < maxImages
        ? collectImages(looseObservations, maxImages - strictImages.length, seenImages)
        : [];

    const images = [...strictImages, ...looseImages];

    return {
      images,
      source: images.length
        ? {
            name: "iNaturalist",
            url: `https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(scientificName)}`,
          }
        : null,
      strictCount: strictImages.length,
      looseCount: looseImages.length,
    };
  } catch (error) {
    console.warn(`[iNaturalistService] Image lookup failed: ${error.message}`);
    return { images: [], source: null, strictCount: 0, looseCount: 0 };
  }
};

export default { getPlantImages };
