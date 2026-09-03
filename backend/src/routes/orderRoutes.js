import { Router } from "express";
import { createOrder, getOrders, getOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb, protect);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);

export default router;
