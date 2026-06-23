import { Resume } from "../models/Resume.js";
import { ResumeAnalysisAgent } from "../agents/ResumeAnalysisAgent.js";

const resumeAgent = new ResumeAnalysisAgent();

/**
 * Upload and parse a resume file (PDF, DOCX, TXT)
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Please upload a PDF, DOCX, or TXT file." });
    }

    const { originalname, buffer, size } = req.file;
    const ext = originalname.split(".").pop().toLowerCase();

    if (!["pdf", "docx", "txt"].includes(ext)) {
      return res.status(400).json({ message: "Unsupported file type. Use PDF, DOCX, or TXT." });
    }

    console.log(`📤 Uploading resume: ${originalname} (${(size / 1024).toFixed(1)} KB)`);

    // Parse resume
    const { rawText, profile } = await resumeAgent.run(buffer, ext);

    // Save to database
    const resume = await Resume.create({
      userId: req.user.id,
      fileName: originalname,
      fileType: ext,
      fileSize: size,
      rawText,
      parsedProfile: profile,
    });

    // If this is the first resume, make it default
    const count = await Resume.countDocuments({ userId: req.user.id });
    if (count === 1) {
      resume.isDefault = true;
      await resume.save();
    }

    res.status(201).json({
      message: "Resume uploaded and parsed successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        parsedProfile: resume.parsedProfile,
        isDefault: resume.isDefault,
        uploadedAt: resume.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Upload resume error:", error);
    res.status(500).json({ message: error.message || "Failed to upload and parse resume" });
  }
};

/**
 * List all resumes for the authenticated user
 */
export const listResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .select("fileName fileType fileSize parsedProfile.name parsedProfile.skills parsedProfile.summary isDefault uploadedAt")
      .sort({ createdAt: -1 });

    res.json({ resumes });
  } catch (error) {
    console.error("List resumes error:", error);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

/**
 * Get a single resume with full parsed profile
 */
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ resume });
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};

/**
 * Delete a resume
 */
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

/**
 * Set a resume as default
 */
export const setDefaultResume = async (req, res) => {
  try {
    // Unset all defaults for user
    await Resume.updateMany({ userId: req.user.id }, { isDefault: false });

    // Set the selected one as default
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Default resume updated", resume });
  } catch (error) {
    console.error("Set default resume error:", error);
    res.status(500).json({ message: "Failed to set default resume" });
  }
};
