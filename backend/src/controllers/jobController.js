import { JobAnalysisAgent } from "../agents/JobAnalysisAgent.js";
import { Job } from "../models/Job.js";

const jobAgent = new JobAnalysisAgent();

/**
 * Analyze a job URL and save results
 */
export const analyzeJob = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Job URL is required" });
    }

    const analysis = await jobAgent.analyze(url);

    const job = await Job.create({
      userId: req.user.id,
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
      preferredQualifications: analysis.preferredQualifications,
      benefits: analysis.benefits,
      applicationDeadline: analysis.applicationDeadline,
    });

    res.json({
      message: "Job analyzed successfully",
      job,
    });
  } catch (error) {
    console.error("Analyze job error:", error);
    res.status(500).json({ message: error.message || "Failed to analyze job" });
  }
};

/**
 * List all analyzed jobs for the user
 */
export const listJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id })
      .select("title company platform location jobType status skills analyzedAt createdAt")
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error("List jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

/**
 * Get a single job with full details
 */
export const getJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ job });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

/**
 * Delete a job
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};
