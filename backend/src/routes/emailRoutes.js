import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { listEmails, getEmail, deleteEmail, sendEmail } from "../controllers/emailController.js";

const router = Router();

router.get("/", authenticate, listEmails);
router.get("/:id", authenticate, getEmail);
router.delete("/:id", authenticate, deleteEmail);
router.post("/send", authenticate, sendEmail);

export default router;
