import plantAggregatorService from "../services/plantAggregatorService.js";

const buildHints = (req) => ({
  commonName: req.query.commonName || undefined,
  scientificName: req.query.scientificName || undefined,
  family: req.query.family || undefined,
  genus: req.query.genus || undefined,
});

const respondWithPlant = (res, { plant, warnings }) => {
  res.json({
    success: true,
    partial: warnings.length > 0,
    warnings,
    plant,
  });
};

export const searchPlants = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name || !name.trim()) {
      const err = new Error("Please provide a plant name to search for.");
      err.statusCode = 400;
      throw err;
    }

    const result = await plantAggregatorService.getOrBuildPlant(name, buildHints(req));
    respondWithPlant(res, result);
  } catch (err) {
    next(err);
  }
};

export const getPlantDetails = async (req, res, next) => {
  try {
    const { plantName } = req.params;
    const result = await plantAggregatorService.getOrBuildPlant(
      decodeURIComponent(plantName),
      buildHints(req)
    );
    respondWithPlant(res, result);
  } catch (err) {
    next(err);
  }
};

export default { searchPlants, getPlantDetails };
