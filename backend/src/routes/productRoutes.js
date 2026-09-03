import { Router } from "express";
import { getProducts, getProduct } from "../controllers/productController.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb);

router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
