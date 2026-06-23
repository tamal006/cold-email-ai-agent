import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  runFullPipeline,
  editEmail,
  changeTone,
  regenerateSubjects,
  scoreEmail,
  updateSubject,
} from "../controllers/generateController.js";

const router = Router();

router.post("/full-pipeline", authenticate, runFullPipeline);
router.post("/edit", authenticate, editEmail);
router.post("/tone", authenticate, changeTone);
router.post("/subjects", authenticate, regenerateSubjects);
router.post("/score", authenticate, scoreEmail);
router.post("/update-subject", authenticate, updateSubject);

export default router;
