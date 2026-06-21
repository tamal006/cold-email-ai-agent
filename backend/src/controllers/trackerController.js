import { JobTracker } from "../models/JobTracker.js";
import { Job } from "../models/Job.js";
import { Email } from "../models/Email.js";
export const getTrackedJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const trackedJobs = await JobTracker.find({ userId }).populate("jobId").populate("contactId").populate("outreachEmailIds").sort({ createdAt: -1 });
    res.json({ trackedJobs });
  } catch (error) {
    console.error("Get tracked jobs error:", error);
    res.status(500).json({ message: "Failed to fetch tracked jobs." });
  }
};
export const addTrackedJob = async (req, res) => {
  try {
    const { jobId, contactId, notes } = req.body;
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
    let tracker = await JobTracker.findOne({ userId, jobId });
    if (tracker) {
      res.status(400).json({ message: "Job is already added to the tracker.", tracker });
      return;
    }
    tracker = await JobTracker.create({
      userId,
      jobId,
      contactId: contactId || void 0,
      title: job.title,
      company: job.company,
      sourceUrl: job.sourceUrl,
      status: "saved",
      notes: notes || "",
      outreachEmailIds: [],
      statusHistory: [{ status: "saved", changedAt: /* @__PURE__ */ new Date(), note: "Added to job tracker" }]
    });
    res.status(201).json({
      message: "Job successfully added to tracker",
      tracker
    });
  } catch (error) {
    console.error("Add tracked job error:", error);
    res.status(500).json({ message: error.message || "Failed to track job." });
  }
};
export const updateTrackerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const userId = req.user?.id;
    const validStatuses = ["saved", "outreach_sent", "applied", "interview_scheduled", "rejected", "offer_received"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid tracker status." });
      return;
    }
    const tracker = await JobTracker.findOne({ _id: id, userId });
    if (!tracker) {
      res.status(404).json({ message: "Tracked job entry not found." });
      return;
    }
    tracker.status = status;
    if (status === "applied" && !tracker.appliedDate) {
      tracker.appliedDate = /* @__PURE__ */ new Date();
    }
    tracker.statusHistory.push({
      status,
      changedAt: /* @__PURE__ */ new Date(),
      note: note || `Status updated to ${status}`
    });
    await tracker.save();
    res.json({
      message: "Status updated successfully",
      tracker
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update job status." });
  }
};
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user?.id;
    const counts = await JobTracker.aggregate([
      { $match: { userId: { $eq: userId } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const statusCounts = {
      saved: 0,
      outreach_sent: 0,
      applied: 0,
      interview_scheduled: 0,
      rejected: 0,
      offer_received: 0
    };
    counts.forEach((c) => {
      if (c._id in statusCounts) {
        statusCounts[c._id] = c.count;
      }
    });
    const totalEmails = await Email.countDocuments({ userId });
    const sentEmails = await Email.countDocuments({ userId, status: "sent" });
    const failedEmails = await Email.countDocuments({ userId, status: "failed" });
    const totalTracked = await JobTracker.countDocuments({ userId });
    const totalOutreachSent = statusCounts.outreach_sent + statusCounts.applied + statusCounts.interview_scheduled + statusCounts.rejected + statusCounts.offer_received;
    const totalApplied = statusCounts.applied + statusCounts.interview_scheduled + statusCounts.rejected + statusCounts.offer_received;
    const totalInterviews = statusCounts.interview_scheduled + statusCounts.offer_received;
    const totalOffers = statusCounts.offer_received;
    const responseCount = totalApplied + totalInterviews + totalOffers;
    const responseRate = totalOutreachSent > 0 ? Math.round(responseCount / totalOutreachSent * 100) : 0;
    const referralRate = totalTracked > 0 ? Math.round((statusCounts.outreach_sent + totalInterviews) / totalTracked * 100) : 0;
    res.json({
      statusCounts,
      stats: {
        totalTracked,
        totalEmails,
        sentEmails,
        failedEmails,
        responseRate,
        referralRate,
        funnel: {
          tracked: totalTracked,
          outreach: totalOutreachSent,
          applied: totalApplied,
          interviews: totalInterviews,
          offers: totalOffers
        }
      }
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ message: "Failed to retrieve analytics." });
  }
};
export const deleteTrackerEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const deleted = await JobTracker.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      res.status(404).json({ message: "Tracked job not found." });
      return;
    }
    res.json({ message: "Job tracker entry deleted successfully" });
  } catch (error) {
    console.error("Delete tracker entry error:", error);
    res.status(500).json({ message: "Failed to delete tracked job entry." });
  }
};
