import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb);

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

export default router;
