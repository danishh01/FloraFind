import plantNetService from "../services/plantNetService.js";
import Identification from "../models/Identification.js";
import { isDbConnected } from "../config/db.js";
import iNaturalistService from "../services/iNaturalistService.js";

export const identifyPlant = async (req, res, next) => {
  try {
    const matches = await plantNetService.identifyPlant(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );
    const matchesWithImages = await Promise.all(
      matches.map(async (match) => {
        const { images } = await iNaturalistService.getPlantImages(match.scientificName, 1);
        return { ...match, image: images[0] || null };
      })
    );

    if (isDbConnected()) {
      try {
        await Identification.create({
          topMatch: matchesWithImages[0] || null,
          matchCount: matchesWithImages.length,
          success: true,
        });
      } catch (saveError) {
        console.error(`[identificationController] Failed to save identification: ${saveError.message}`);
      }
    }

    res.json({ success: true, matches: matchesWithImages });
  } catch (err) {
    if (isDbConnected()) {
      try {
        await Identification.create({
          matchCount: 0,
          success: false,
          errorMessage: err.message,
        });
      } catch (saveError) {
        console.error(`[identificationController] Failed to save identification error: ${saveError.message}`);
      }
    }
    next(err);
  }
};

export default { identifyPlant };
