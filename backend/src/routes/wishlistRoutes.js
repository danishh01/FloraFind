import { Router } from "express";
import { getWishlist, addProduct, removeProduct } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb, protect);

router.get("/", getWishlist);
router.post("/:productId", addProduct);
router.delete("/:productId", removeProduct);

export default router;
