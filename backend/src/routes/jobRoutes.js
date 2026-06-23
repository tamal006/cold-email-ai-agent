import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { analyzeJob, listJobs, getJob, deleteJob } from "../controllers/jobController.js";

const router = Router();

router.post("/analyze", authenticate, analyzeJob);
router.get("/list", authenticate, listJobs);
router.get("/:id", authenticate, getJob);
router.delete("/:id", authenticate, deleteJob);

export default router;
