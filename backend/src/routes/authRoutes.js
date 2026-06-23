import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { getFullProfile, updateProfile } from "../controllers/profileController.js";
import { auth } from "../middleware/auth.js";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getFullProfile);
router.put("/profile", auth, updateProfile);
export default router;

