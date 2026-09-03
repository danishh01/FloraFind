/**
 * Normalizes a plant name query so "Neem", "neem", "NEEM", " Neem " and
 * "Azadirachta indica" can all be matched/cached consistently.
 */
export const normalizePlantName = (name) => {
  if (!name) return "";
  return name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s.-]/g, "");
};

export default normalizePlantName;
