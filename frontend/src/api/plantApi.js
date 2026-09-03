import { apiGet, apiPostForm } from "./client";

/**
 * Identifies a plant from an image file via POST /api/identify.
 * Returns the top matches: [{ scientificName, commonName, family, genus, score }]
 */
export const identifyPlant = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { matches } = await apiPostForm("/identify", formData);
  return matches;
};

/**
 * Fetches full plant details via GET /api/plants/:plantName.
 * `hints` (optional): { commonName, family, genus, scientificName } already
 * known from a prior identification/search step, used to skip guessing.
 */
export const getPlantDetails = async (plantName, hints = {}) => {
  const params = new URLSearchParams();
  Object.entries(hints).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString() ? `?${params.toString()}` : "";

  const { plant, warnings, partial } = await apiGet(
    `/plants/${encodeURIComponent(plantName)}${query}`
  );
  return { plant, warnings, partial };
};
