import { Email } from "../models/Email.js";
import { Job } from "../models/Job.js";
import { Resume } from "../models/Resume.js";
import { Draft } from "../models/Draft.js";

/**
 * Get dashboard statistics for the authenticated user
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [emailCount, jobCount, resumeCount, draftCount, recentEmails, recentJobs] =
      await Promise.all([
        Email.countDocuments({ userId }),
        Job.countDocuments({ userId }),
        Resume.countDocuments({ userId }),
        Draft.countDocuments({ userId }),
        Email.find({ userId })
          .select("jobTitle company subject tone qualityScores.overallScore matchAnalysis.matchScore status createdAt")
          .sort({ createdAt: -1 })
          .limit(5),
        Job.find({ userId })
          .select("title company platform status analyzedAt createdAt")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    // Calculate average match score
    const emailsWithScore = await Email.find({
      userId,
      "matchAnalysis.matchScore": { $gt: 0 },
    }).select("matchAnalysis.matchScore");

    const avgMatchScore =
      emailsWithScore.length > 0
        ? Math.round(
            emailsWithScore.reduce(
              (sum, e) => sum + (e.matchAnalysis?.matchScore || 0),
              0
            ) / emailsWithScore.length
          )
        : 0;

    res.json({
      stats: {
        totalEmails: emailCount,
        totalJobs: jobCount,
        totalResumes: resumeCount,
        totalDrafts: draftCount,
        avgMatchScore,
      },
      recentEmails,
      recentJobs,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
