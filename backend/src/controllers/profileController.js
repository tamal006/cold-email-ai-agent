import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { ResumeMatchingAgent } from "../agents/ResumeMatchingAgent.js";
const resumeMatchingAgent = new ResumeMatchingAgent();
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { headline, skills, experience, education, resumeText, projects, achievements } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    if (headline !== void 0) user.headline = headline;
    if (skills !== void 0) user.skills = skills;
    if (experience !== void 0) user.experience = experience;
    if (education !== void 0) user.education = education;
    if (resumeText !== void 0) user.resumeText = resumeText;
    if (projects !== void 0) user.projects = projects;
    if (achievements !== void 0) user.achievements = achievements;
    await user.save();
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        resumeText: user.resumeText,
        projects: user.projects,
        achievements: user.achievements,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update user profile." });
  }
};
export const matchResume = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.body;
    if (!jobId) {
      res.status(400).json({ message: "jobId is required for resume matching." });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    const job = await Job.findOne({ _id: jobId, userId });
    if (!job) {
      res.status(404).json({ message: "Job not found." });
      return;
    }
    const result = await resumeMatchingAgent.match({
      resumeText: user.resumeText || "",
      userSkills: user.skills,
      userExperience: user.experience,
      jobTitle: job.title,
      jobDescription: job.description,
      jobSkills: job.skills,
      jobExperience: job.experienceRequired
    });
    res.json({
      message: "Resume matched successfully",
      match: result
    });
  } catch (error) {
    console.error("Resume match error:", error);
    res.status(500).json({ message: error.message || "Failed to match resume." });
  }
};
export const getFullProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        resumeText: user.resumeText,
        projects: user.projects,
        achievements: user.achievements,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Get full profile error:", error);
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
};
