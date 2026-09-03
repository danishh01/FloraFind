import axios from "axios";

// ---------------------------------------------------------------------------
// iNaturalist (https://www.inaturalist.org) is the image source for
// FloraFind. Every image is a real, user-submitted observation photo for
// the exact requested species - never a generic/unrelated search image, and
// never a different species substituted just to reach a target count.
//
// Progressive filtering, correctness over quantity:
//   LEVEL 1 (strict) - exact species match + community "research grade"
//     (the identification has been confirmed by the iNaturalist community).
//   LEVEL 2 (loose)  - exact species match + "needs_id" grade (still a real
//     observation of the right species, just not yet community-confirmed) -
//     only used to fill in when strict alone isn't enough.
// "casual" grade observations (often missing a confirmed ID or the minimum
// required data) are never used at either level. If fewer than the desired
// number of correctly-identified images exist, only those are returned -
// this service never reaches for a wrong species just to pad the count.
// ---------------------------------------------------------------------------

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
 * Fetches real iNaturalist observation photos for a scientific name, using
 * progressive strict -> loose filtering (see file header). Never invents a
 * URL, never substitutes a different species, and never throws - any
 * failure or lack of usable images resolves to an empty result so the
 * caller can fall back to a local placeholder.
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
