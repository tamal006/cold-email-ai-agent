import { Router } from "express";
import { generateOutreach, scoreOutreach, sendOutreachEmail } from "../controllers/outreachController.js";
import { auth } from "../middleware/auth.js";
const router = Router();
router.use(auth);
router.post("/generate", generateOutreach);
router.post("/score", scoreOutreach);
router.post("/send", sendOutreachEmail);
export default router;
