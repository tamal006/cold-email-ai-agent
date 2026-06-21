import { Job } from "../models/Job.js";
import { JobAnalysisAgent } from "../agents/JobAnalysisAgent.js";
const jobAgent = new JobAnalysisAgent();
export const analyzeJob = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ message: "Job posting URL is required." });
      return;
    }
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    let job = await Job.findOne({ userId, sourceUrl: url });
    if (job) {
      res.json({
        message: "Job already analyzed",
        job
      });
      return;
    }
    const analysis = await jobAgent.analyze(url);
    job = await Job.create({
      userId,
      sourceUrl: url,
      platform: analysis.platform,
      title: analysis.title,
      company: analysis.company,
      location: analysis.location,
      salary: analysis.salary,
      jobType: analysis.jobType,
      skills: analysis.skills,
      responsibilities: analysis.responsibilities,
      experienceRequired: analysis.experienceRequired,
      keywords: analysis.keywords,
      description: analysis.description,
      qualifications: analysis.qualifications,
      benefits: analysis.benefits,
      status: "analyzed",
      analyzedAt: /* @__PURE__ */ new Date()
    });
    res.status(201).json({
      message: "Job analyzed and saved successfully",
      job
    });
  } catch (error) {
    console.error("Job analyze error:", error);
    res.status(500).json({ message: error.message || "Failed to analyze job URL." });
  }
};
export const getJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const jobs = await Job.find({ userId }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs." });
  }
};
export const getJobById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const job = await Job.findOne({ _id: id, userId });
    if (!job) {
      res.status(404).json({ message: "Job not found." });
      return;
    }
    res.json({ job });
  } catch (error) {
    console.error("Get job by ID error:", error);
    res.status(500).json({ message: "Failed to fetch job details." });
  }
};
export const deleteJob = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const deleted = await Job.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      res.status(404).json({ message: "Job not found or unauthorized." });
      return;
    }
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Failed to delete job." });
  }
};
