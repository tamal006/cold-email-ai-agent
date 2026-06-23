import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import multer from "multer";
import {
  uploadResume,
  listResumes,
  getResume,
  deleteResume,
  setDefaultResume,
} from "../controllers/resumeController.js";

const router = Router();

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Use PDF, DOCX, or TXT."), false);
    }
  },
});

router.post("/upload", authenticate, upload.single("resume"), uploadResume);
router.get("/list", authenticate, listResumes);
router.get("/:id", authenticate, getResume);
router.delete("/:id", authenticate, deleteResume);
router.patch("/:id/default", authenticate, setDefaultResume);

export default router;
