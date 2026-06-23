import { JobAnalysisAgent } from "../agents/JobAnalysisAgent.js";
import { CandidateMatchingAgent } from "../agents/CandidateMatchingAgent.js";
import { EmailGenerationAgent } from "../agents/EmailGenerationAgent.js";
import { EmailEditingAgent } from "../agents/EmailEditingAgent.js";
import { ToneTransformationAgent } from "../agents/ToneTransformationAgent.js";
import { EmailScoringAgent } from "../agents/EmailScoringAgent.js";
import { Resume } from "../models/Resume.js";
import { Job } from "../models/Job.js";
import { Email } from "../models/Email.js";

const jobAgent = new JobAnalysisAgent();
const matchAgent = new CandidateMatchingAgent();
const emailAgent = new EmailGenerationAgent();
const editAgent = new EmailEditingAgent();
const toneAgent = new ToneTransformationAgent();
const scoreAgent = new EmailScoringAgent();

/**
 * Full pipeline: Job URL → Job Analysis → Resume Match → Email Generation
 */
export const runFullPipeline = async (req, res) => {
  try {
    const { jobUrl, resumeId, userSummary, instructions } = req.body;

    if (!jobUrl) {
      return res.status(400).json({ message: "Job URL is required" });
    }
    if (!resumeId) {
      return res.status(400).json({ message: "Resume ID is required. Please upload a resume first." });
    }

    // 1. Fetch the resume
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    console.log("\n🚀 Starting full email generation pipeline...");
    console.log(`   Job URL: ${jobUrl}`);
    console.log(`   Resume: ${resume.fileName}`);

    // 2. Analyze the job
    console.log("\n--- Step 1: Job Analysis ---");
    const jobAnalysis = await jobAgent.analyze(jobUrl);

    // Save job to database
    const job = await Job.create({
      userId: req.user.id,
      sourceUrl: jobUrl,
      platform: jobAnalysis.platform,
      title: jobAnalysis.title,
      company: jobAnalysis.company,
      location: jobAnalysis.location,
      salary: jobAnalysis.salary,
      jobType: jobAnalysis.jobType,
      skills: jobAnalysis.skills,
      responsibilities: jobAnalysis.responsibilities,
      experienceRequired: jobAnalysis.experienceRequired,
      keywords: jobAnalysis.keywords,
      description: jobAnalysis.description,
      qualifications: jobAnalysis.qualifications,
      preferredQualifications: jobAnalysis.preferredQualifications,
      benefits: jobAnalysis.benefits,
      applicationDeadline: jobAnalysis.applicationDeadline,
    });

    // 3. Match candidate against job
    console.log("\n--- Step 2: Candidate Matching ---");
    const matchAnalysis = await matchAgent.match(jobAnalysis, resume.parsedProfile);

    // 4. Generate email
    console.log("\n--- Step 3: Email Generation ---");
    const emailResult = await emailAgent.run({
      jobAnalysis,
      resumeProfile: resume.parsedProfile,
      matchAnalysis,
      userSummary: userSummary || "",
      userInstructions: instructions || "",
    });

    // 5. Save email to database
    const savedEmail = await Email.create({
      userId: req.user.id,
      jobId: job._id,
      resumeId: resume._id,
      jobTitle: jobAnalysis.title,
      company: jobAnalysis.company,
      jobUrl,
      resumeProfileSnapshot: resume.parsedProfile,
      matchAnalysis: {
        matchScore: matchAnalysis.matchScore,
        matchingSkills: matchAnalysis.matchingSkills,
        missingSkills: matchAnalysis.missingSkills,
        strengths: matchAnalysis.strengths,
        weaknesses: matchAnalysis.weaknesses,
      },
      userSummary,
      userInstructions: instructions,
      subject: emailResult.subject,
      content: emailResult.content,
      htmlContent: emailResult.htmlContent,
      tone: "professional",
      subjectOptions: emailResult.subjectOptions || [],
      qualityScores: emailResult.qualityScores,
      status: "draft",
    });

    // Update job status
    job.status = "email_generated";
    await job.save();

    console.log("\n✅ Full pipeline complete!");

    res.json({
      message: "Email generated successfully",
      email: savedEmail,
      jobAnalysis: {
        id: job._id,
        title: jobAnalysis.title,
        company: jobAnalysis.company,
        location: jobAnalysis.location,
        jobType: jobAnalysis.jobType,
        skills: jobAnalysis.skills,
        responsibilities: jobAnalysis.responsibilities,
        experienceRequired: jobAnalysis.experienceRequired,
        qualifications: jobAnalysis.qualifications,
        description: jobAnalysis.description,
      },
      matchAnalysis,
      qualityScores: emailResult.qualityScores,
      subjectOptions: emailResult.subjectOptions,
    });
  } catch (error) {
    console.error("Full pipeline error:", error);
    res.status(500).json({ message: error.message || "Failed to generate email" });
  }
};

/**
 * AI Chat Edit: modify email based on user instruction
 */
export const editEmail = async (req, res) => {
  try {
    const { emailId, instruction, chatHistory } = req.body;

    if (!emailId || !instruction) {
      return res.status(400).json({ message: "Email ID and instruction are required" });
    }

    const email = await Email.findOne({ _id: emailId, userId: req.user.id });
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    const context = {
      jobTitle: email.jobTitle,
      company: email.company,
      skills: email.resumeProfileSnapshot?.skills || [],
      achievements: email.resumeProfileSnapshot?.achievements || [],
      projects: email.resumeProfileSnapshot?.projects?.map((p) => p.name) || [],
    };

    const result = await editAgent.edit(
      email.content,
      email.subject,
      instruction,
      chatHistory || [],
      context
    );

    // Save version history
    email.versions.push({
      subject: email.subject,
      content: email.content,
      tone: email.tone,
      editInstruction: instruction,
    });

    // Update email
    email.subject = result.subject;
    email.content = result.content;
    email.htmlContent = result.htmlContent;
    await email.save();

    res.json({
      message: "Email updated",
      email,
      changeDescription: result.changeDescription,
    });
  } catch (error) {
    console.error("Edit email error:", error);
    res.status(500).json({ message: error.message || "Failed to edit email" });
  }
};

/**
 * Transform email tone
 */
export const changeTone = async (req, res) => {
  try {
    const { emailId, tone } = req.body;

    if (!emailId || !tone) {
      return res.status(400).json({ message: "Email ID and tone are required" });
    }

    const email = await Email.findOne({ _id: emailId, userId: req.user.id });
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    const result = await toneAgent.transform(email.content, email.subject, tone);

    // Save version
    email.versions.push({
      subject: email.subject,
      content: email.content,
      tone: email.tone,
      editInstruction: `Tone changed to ${tone}`,
    });

    // Update
    email.subject = result.subject;
    email.content = result.content;
    email.htmlContent = result.htmlContent;
    email.tone = tone;
    await email.save();

    res.json({
      message: `Tone changed to ${tone}`,
      email,
    });
  } catch (error) {
    console.error("Change tone error:", error);
    res.status(500).json({ message: error.message || "Failed to change tone" });
  }
};

/**
 * Regenerate subject line options
 */
export const regenerateSubjects = async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ message: "Email ID is required" });
    }

    const email = await Email.findOne({ _id: emailId, userId: req.user.id });
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    const subjects = await emailAgent.generateSubjectLines(
      email.content,
      { title: email.jobTitle, company: email.company },
      email.resumeProfileSnapshot || { name: "Candidate", skills: [] }
    );

    email.subjectOptions = subjects;
    await email.save();

    res.json({ message: "Subject lines regenerated", subjects });
  } catch (error) {
    console.error("Regenerate subjects error:", error);
    res.status(500).json({ message: error.message || "Failed to regenerate subjects" });
  }
};

/**
 * Score email quality
 */
export const scoreEmail = async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ message: "Email ID is required" });
    }

    const email = await Email.findOne({ _id: emailId, userId: req.user.id });
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    const scores = await scoreAgent.score(email.subject, email.content);

    email.qualityScores = scores;
    await email.save();

    res.json({ message: "Email scored", qualityScores: scores });
  } catch (error) {
    console.error("Score email error:", error);
    res.status(500).json({ message: error.message || "Failed to score email" });
  }
};

/**
 * Update email subject (from subject options)
 */
export const updateSubject = async (req, res) => {
  try {
    const { emailId, subject } = req.body;

    if (!emailId || !subject) {
      return res.status(400).json({ message: "Email ID and subject are required" });
    }

    const email = await Email.findOneAndUpdate(
      { _id: emailId, userId: req.user.id },
      { subject },
      { new: true }
    );

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json({ message: "Subject updated", email });
  } catch (error) {
    console.error("Update subject error:", error);
    res.status(500).json({ message: error.message || "Failed to update subject" });
  }
};
