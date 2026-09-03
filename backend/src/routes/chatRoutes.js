import { Router } from "express";
import { sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb, protect);

router.post("/", sendMessage);

export default router;
