import { ColdEmailAgent } from "../agents/ColdEmailAgent.js";
import { EmailSenderTool } from "../tools/EmailSenderTool.js";
import { EmailHistoryTool } from "../tools/EmailHistoryTool.js";
import { SubjectOptimizerTool } from "../tools/SubjectOptimizerTool.js";
import { validationResult } from "express-validator";
const agent = new ColdEmailAgent();
const emailSender = new EmailSenderTool();
const emailHistory = new EmailHistoryTool();
const subjectOptimizer = new SubjectOptimizerTool();
export const generateEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: "Validation failed", errors: errors.array() });
      return;
    }
    const {
      recipientEmail,
      recipientName,
      companyName,
      jobPosition,
      purpose,
      userBackground,
      additionalNotes,
      tone = "professional"
    } = req.body;
    const result = await agent.run({
      recipientEmail,
      recipientName,
      companyName,
      jobPosition,
      purpose,
      userBackground,
      additionalNotes,
      tone
    });
    const savedEmail = await emailHistory.saveEmail({
      userId: req.user?.id,
      recipientEmail,
      recipientName,
      companyName,
      jobPosition,
      purpose,
      userBackground,
      additionalNotes,
      tone,
      subject: result.subject,
      content: result.content,
      htmlContent: result.htmlContent,
      status: "draft",
      qualityScore: result.qualityScore,
      suggestions: result.suggestions
    });
    res.json({
      message: "Email generated successfully",
      email: savedEmail,
      qualityScore: result.qualityScore,
      validationDetails: result.validationDetails,
      suggestions: result.suggestions,
      alternativeSubjects: result.alternativeSubjects,
      attempts: result.attempts
    });
  } catch (error) {
    console.error("Generate email error:", error);
    res.status(500).json({ message: error.message || "Failed to generate email" });
  }
};
export const sendEmail = async (req, res) => {
  try {
    const { emailId } = req.body;
    const email = await emailHistory.getEmailById(emailId, req.user?.id);
    if (!email) {
      res.status(404).json({ message: "Email not found" });
      return;
    }
    const result = await emailSender.send({
      to: email.recipientEmail,
      subject: email.subject,
      text: email.content,
      html: email.htmlContent
    });
    if (result.success) {
      await emailHistory.updateEmail(emailId, {
        status: "sent",
        sentAt: /* @__PURE__ */ new Date()
      });
      res.json({
        message: "Email sent successfully",
        messageId: result.messageId
      });
    } else {
      await emailHistory.updateEmail(emailId, {
        status: "failed"
      });
      res.status(500).json({
        message: "Failed to send email",
        error: result.error
      });
    }
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ message: error.message || "Failed to send email" });
  }
};
export const saveDraft = async (req, res) => {
  try {
    const { emailId, subject, content, htmlContent } = req.body;
    if (emailId) {
      const updated = await emailHistory.updateEmail(emailId, {
        subject,
        content,
        htmlContent,
        status: "draft"
      });
      if (!updated) {
        res.status(404).json({ message: "Email not found" });
        return;
      }
      res.json({ message: "Draft updated", email: updated });
    } else {
      const saved = await emailHistory.saveEmail({
        ...req.body,
        userId: req.user?.id,
        status: "draft"
      });
      res.json({ message: "Draft saved", email: saved });
    }
  } catch (error) {
    console.error("Save draft error:", error);
    res.status(500).json({ message: error.message || "Failed to save draft" });
  }
};
export const getVariations = async (req, res) => {
  try {
    const variations = await agent.generateVariations(req.body);
    res.json({ message: "Variations generated", variations });
  } catch (error) {
    console.error("Variations error:", error);
    res.status(500).json({ message: error.message || "Failed to generate variations" });
  }
};
export const optimizeSubject = async (req, res) => {
  try {
    const { subject, content, purpose } = req.body;
    const subjects = await subjectOptimizer.optimize(subject, content, purpose);
    res.json({ message: "Subjects generated", subjects });
  } catch (error) {
    console.error("Optimize subject error:", error);
    res.status(500).json({ message: error.message || "Failed to optimize subject" });
  }
};
