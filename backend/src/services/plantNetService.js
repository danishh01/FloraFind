import axios from "axios";
import FormData from "form-data";

const PLANTNET_BASE_URL = "https://my-api.plantnet.org/v2/identify";

/**
 * Identifies a plant from an image buffer using the PlantNet API.
 * Returns the top matches normalized to the shape the frontend needs.
 * Never fabricates results - if the API key is missing or the request
 * fails, it throws so the controller can surface a clear error instead
 * of silently returning made-up matches.
 */
export const identifyPlant = async (buffer, mimetype, originalname) => {
  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    const err = new Error(
      "Plant identification is not configured on the server (missing PlantNet API key)."
    );
    err.statusCode = 503;
    throw err;
  }

  const project = process.env.PLANTNET_PROJECT || "all";
  const url = `${PLANTNET_BASE_URL}/${project}?api-key=${apiKey}`;

  const form = new FormData();
  form.append("images", buffer, {
    filename: originalname || "plant.jpg",
    contentType: mimetype,
  });
  form.append("organs", "auto");

  let response;
  try {
    response = await axios.post(url, form, {
      headers: form.getHeaders(),
      params: {
        "nb-results": 3,
        lang: "en",
      },
      timeout: 20000,
    });
  } catch (err) {
    const status = err.response?.status;
    if (status === 404) {
      const notFoundErr = new Error(
        "No matching plant could be identified from this image."
      );
      notFoundErr.statusCode = 404;
      throw notFoundErr;
    }

    const messages = {
      400: "PlantNet rejected the image. Please upload a clear JPG or PNG plant photo.",
      401: "PlantNet authentication failed. Check the API key.",
      403: "PlantNet access is forbidden. Check the API key permissions or account restrictions.",
      429: "PlantNet daily request quota has been exceeded. Please try again later.",
    };
    const wrappedErr = new Error(
      messages[status] || "Plant identification service is currently unavailable."
    );
    wrappedErr.statusCode = messages[status] ? status : 502;
    throw wrappedErr;
  }

  const results = response.data?.results || [];

  const matches = results.slice(0, 3).map((r) => ({
    scientificName: r.species?.scientificNameWithoutAuthor || r.species?.scientificName || "Unknown",
    commonName: r.species?.commonNames?.[0] || null,
    family: r.species?.family?.scientificNameWithoutAuthor || null,
    genus: r.species?.genus?.scientificNameWithoutAuthor || null,
    score: typeof r.score === "number" ? Math.round(r.score * 100) / 100 : null,
  }));

  return matches;
};

export default { identifyPlant };
