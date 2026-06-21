import { EmailHistoryTool } from "../tools/EmailHistoryTool.js";
import { templates } from "../utils/templates.js";
const emailHistory = new EmailHistoryTool();
export const getEmails = async (req, res) => {
  try {
    const { status, search, page = "1", limit = "10" } = req.query;
    const result = await emailHistory.getEmails(req.user?.id, {
      status,
      search,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
    res.json({
      emails: result.emails,
      total: result.total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(result.total / parseInt(limit, 10))
    });
  } catch (error) {
    console.error("Get emails error:", error);
    res.status(500).json({ message: "Failed to fetch emails" });
  }
};
export const getEmailById = async (req, res) => {
  try {
    const email = await emailHistory.getEmailById(req.params.id, req.user?.id);
    if (!email) {
      res.status(404).json({ message: "Email not found" });
      return;
    }
    res.json({ email });
  } catch (error) {
    console.error("Get email error:", error);
    res.status(500).json({ message: "Failed to fetch email" });
  }
};
export const deleteEmail = async (req, res) => {
  try {
    const deleted = await emailHistory.deleteEmail(req.params.id, req.user?.id);
    if (!deleted) {
      res.status(404).json({ message: "Email not found" });
      return;
    }
    res.json({ message: "Email deleted successfully" });
  } catch (error) {
    console.error("Delete email error:", error);
    res.status(500).json({ message: "Failed to delete email" });
  }
};
export const getStats = async (req, res) => {
  try {
    const stats = await emailHistory.getStats(req.user?.id);
    const activity = await emailHistory.getWeeklyActivity(req.user?.id);
    res.json({ stats, activity });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
export const getTemplates = async (_req, res) => {
  try {
    res.json({ templates });
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
};
