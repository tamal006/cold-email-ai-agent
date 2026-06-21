import { Job } from "../models/Job.js";
import { Contact } from "../models/Contact.js";
import { Company } from "../models/Company.js";
import { User } from "../models/User.js";
import { Email } from "../models/Email.js";
import { JobTracker } from "../models/JobTracker.js";
import { OutreachAgent } from "../agents/OutreachAgent.js";
import { OutreachScorerTool } from "../tools/OutreachScorerTool.js";
import { EmailSenderTool } from "../tools/EmailSenderTool.js";
const outreachAgent = new OutreachAgent();
const outreachScorer = new OutreachScorerTool();
const emailSender = new EmailSenderTool();
export const generateOutreach = async (req, res) => {
  try {
    const { jobId, contactId, outreachType, additionalInstructions } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const job = await Job.findOne({ _id: jobId, userId });
    if (!job) {
      res.status(404).json({ message: "Job not found." });
      return;
    }
    let contact = null;
    if (contactId) {
      contact = await Contact.findOne({ _id: contactId, userId });
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    const company = await Company.findOne({ userId, name: { $regex: new RegExp(`^${job.company}$`, "i") } });
    const input = {
      outreachType: outreachType || "job_application",
      contactName: contact?.fullName || "Hiring Team",
      contactRole: contact?.role || "Recruiting Team member",
      contactEmail: contact?.email || void 0,
      companyName: job.company,
      companyMission: company?.mission,
      companyProducts: company?.products,
      companyInsight: company?.insightSummary,
      jobTitle: job.title,
      jobSkills: job.skills,
      jobDescription: job.description,
      userName: user.name,
      userHeadline: user.headline,
      userSkills: user.skills,
      userExperience: user.experience,
      userAchievements: user.achievements,
      additionalInstructions: additionalInstructions || ""
    };
    const result = await outreachAgent.generate(input);
    const isReferral = outreachType === "referral_request";
    const primarySubject = result.subjectLine;
    const primaryContent = isReferral ? result.referralRequestEmail : result.coldEmail;
    const primaryHtml = isReferral ? result.referralRequestEmailHtml : result.coldEmailHtml;
    const scores = await outreachScorer.score(
      primarySubject,
      primaryContent,
      outreachType || "job_application",
      contact?.role || "Hiring Team"
    );
    const draftEmail = await Email.create({
      userId,
      recipientEmail: contact?.email || "hiring@" + job.company.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com",
      recipientName: contact?.fullName || "Hiring Team",
      companyName: job.company,
      jobPosition: job.title,
      purpose: outreachType || "job_application",
      userBackground: user.headline || "",
      additionalNotes: additionalInstructions || "",
      tone: "professional",
      subject: primarySubject,
      content: primaryContent,
      htmlContent: primaryHtml,
      status: "draft",
      qualityScore: scores.overallScore,
      suggestions: scores.improvements
    });
    const tracker = await JobTracker.findOne({ userId, jobId });
    if (tracker) {
      if (!tracker.outreachEmailIds.includes(draftEmail._id)) {
        tracker.outreachEmailIds.push(draftEmail._id);
        await tracker.save();
      }
    }
    res.json({
      message: "Outreach messages generated and saved as draft.",
      outreach: result,
      scores,
      emailId: draftEmail._id,
      recipientEmail: draftEmail.recipientEmail
    });
  } catch (error) {
    console.error("Generate outreach error:", error);
    res.status(500).json({ message: error.message || "Failed to generate outreach." });
  }
};
export const scoreOutreach = async (req, res) => {
  try {
    const { subject, content, outreachType, contactRole } = req.body;
    if (!subject || !content) {
      res.status(400).json({ message: "Subject and content are required to score outreach." });
      return;
    }
    const scores = await outreachScorer.score(
      subject,
      content,
      outreachType || "job_application",
      contactRole || "Hiring Team"
    );
    res.json({ scores });
  } catch (error) {
    console.error("Score outreach error:", error);
    res.status(500).json({ message: "Failed to score outreach." });
  }
};
export const sendOutreachEmail = async (req, res) => {
  try {
    const { emailId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const email = await Email.findOne({ _id: emailId, userId });
    if (!email) {
      res.status(404).json({ message: "Email draft not found." });
      return;
    }
    const result = await emailSender.send({
      to: email.recipientEmail,
      subject: email.subject,
      text: email.content,
      html: email.htmlContent
    });
    if (result.success) {
      email.status = "sent";
      email.sentAt = /* @__PURE__ */ new Date();
      await email.save();
      const job = await Job.findOne({ userId, company: email.companyName, title: email.jobPosition });
      if (job) {
        const tracker = await JobTracker.findOne({ userId, jobId: job._id });
        if (tracker) {
          tracker.status = "outreach_sent";
          tracker.statusHistory.push({
            status: "outreach_sent",
            changedAt: /* @__PURE__ */ new Date(),
            note: `Outreach email sent to ${email.recipientName} (${email.recipientEmail})`
          });
          await tracker.save();
        }
      }
      res.json({
        message: "Outreach email sent successfully.",
        messageId: result.messageId
      });
    } else {
      email.status = "failed";
      await email.save();
      res.status(500).json({
        message: "Failed to send outreach email via SMTP.",
        error: result.error
      });
    }
  } catch (error) {
    console.error("Send outreach error:", error);
    res.status(500).json({ message: error.message || "Failed to send outreach." });
  }
};
