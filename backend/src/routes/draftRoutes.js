import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  saveDraft,
  listDrafts,
  getDraft,
  updateDraft,
  deleteDraft,
} from "../controllers/draftController.js";

const router = Router();

router.post("/", authenticate, saveDraft);
router.get("/", authenticate, listDrafts);
router.get("/:id", authenticate, getDraft);
router.put("/:id", authenticate, updateDraft);
router.delete("/:id", authenticate, deleteDraft);

export default router;
