import { Router } from "express";
import { submitMessage } from "../controllers/contactController.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb);

router.post("/", submitMessage);

export default router;
