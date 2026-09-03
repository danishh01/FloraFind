import { Router } from "express";
import { identifyPlant } from "../controllers/identificationController.js";
import { handleUpload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/", handleUpload, identifyPlant);

export default router;
