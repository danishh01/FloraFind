import { Router } from "express";
import { searchPlants, getPlantDetails } from "../controllers/plantController.js";

const router = Router();

// IMPORTANT: /search must be registered before the /:plantName catch-all
// (both are single path segments, so order matters between them).
router.get("/search", searchPlants);
router.get("/:plantName", getPlantDetails);

export default router;
