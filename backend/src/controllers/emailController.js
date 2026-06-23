import { Email } from "../models/Email.js";
import { EmailSenderTool } from "../tools/EmailSenderTool.js";

const emailSender = new EmailSenderTool();

/**
 * List all generated emails for the user
 */
export const listEmails = async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.user.id })
      .select("jobTitle company subject tone qualityScores.overallScore matchAnalysis.matchScore status createdAt")
      .sort({ createdAt: -1 });

    res.json({ emails });
  } catch (error) {
    console.error("List emails error:", error);
    res.status(500).json({ message: "Failed to fetch emails" });
  }
};

/**
 * Get a single email with full details
 */
export const getEmail = async (req, res) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json({ email });
  } catch (error) {
    console.error("Get email error:", error);
    res.status(500).json({ message: "Failed to fetch email" });
  }
};

/**
 * Delete an email
 */
export const deleteEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json({ message: "Email deleted" });
  } catch (error) {
    console.error("Delete email error:", error);
    res.status(500).json({ message: "Failed to delete email" });
  }
};

/**
 * Send an email via SMTP
 */
export const sendEmail = async (req, res) => {
  try {
    const { emailId, recipientEmail } = req.body;

    if (!emailId || !recipientEmail) {
      return res.status(400).json({ message: "Email ID and recipient email are required" });
    }

    const email = await Email.findOne({ _id: emailId, userId: req.user.id });
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    const result = await emailSender.send({
      to: recipientEmail,
      subject: email.subject,
      text: email.content,
      html: email.htmlContent,
    });

    if (result.success) {
      email.status = "sent";
      email.sentAt = new Date();
      await email.save();

      res.json({ message: "Email sent successfully", messageId: result.messageId });
    } else {
      email.status = "failed";
      await email.save();

      res.status(500).json({ message: "Failed to send email", error: result.error });
    }
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ message: error.message || "Failed to send email" });
  }
};
