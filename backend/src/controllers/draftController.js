import { Draft } from "../models/Draft.js";

/**
 * Save a new draft
 */
export const saveDraft = async (req, res) => {
  try {
    const { jobId, resumeId, jobTitle, company, subject, content, htmlContent, tone, chatHistory, matchScore, qualityScores } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ message: "Subject and content are required" });
    }

    const draft = await Draft.create({
      userId: req.user.id,
      jobId,
      resumeId,
      jobTitle,
      company,
      subject,
      content,
      htmlContent: htmlContent || "",
      tone: tone || "professional",
      chatHistory: chatHistory || [],
      matchScore,
      qualityScores: qualityScores || {},
    });

    res.status(201).json({ message: "Draft saved", draft });
  } catch (error) {
    console.error("Save draft error:", error);
    res.status(500).json({ message: error.message || "Failed to save draft" });
  }
};

/**
 * List all drafts for the user
 */
export const listDrafts = async (req, res) => {
  try {
    const drafts = await Draft.find({ userId: req.user.id })
      .select("jobTitle company subject tone matchScore lastEditedAt createdAt")
      .sort({ lastEditedAt: -1 });

    res.json({ drafts });
  } catch (error) {
    console.error("List drafts error:", error);
    res.status(500).json({ message: "Failed to fetch drafts" });
  }
};

/**
 * Get a single draft
 */
export const getDraft = async (req, res) => {
  try {
    const draft = await Draft.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.json({ draft });
  } catch (error) {
    console.error("Get draft error:", error);
    res.status(500).json({ message: "Failed to fetch draft" });
  }
};

/**
 * Update a draft
 */
export const updateDraft = async (req, res) => {
  try {
    const updates = { ...req.body, lastEditedAt: new Date() };

    const draft = await Draft.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.json({ message: "Draft updated", draft });
  } catch (error) {
    console.error("Update draft error:", error);
    res.status(500).json({ message: error.message || "Failed to update draft" });
  }
};

/**
 * Delete a draft
 */
export const deleteDraft = async (req, res) => {
  try {
    const draft = await Draft.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.json({ message: "Draft deleted" });
  } catch (error) {
    console.error("Delete draft error:", error);
    res.status(500).json({ message: "Failed to delete draft" });
  }
};
