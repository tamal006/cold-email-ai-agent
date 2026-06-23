import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getStats } from "../controllers/dashboardController.js";

const router = Router();

router.get("/stats", authenticate, getStats);

export default router;
