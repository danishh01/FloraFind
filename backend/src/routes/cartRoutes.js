import { Router } from "express";
import { getCart, addItem, updateItem, removeItem, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb, protect);

router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:productId", updateItem);
router.delete("/items/:productId", removeItem);
router.delete("/", clearCart);

export default router;
