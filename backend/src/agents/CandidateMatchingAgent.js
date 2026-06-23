import OpenAI from "openai";
import { env } from "../config/env.js";

const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export class CandidateMatchingAgent {
  /**
   * Compare a parsed resume profile against a parsed job description.
   * Returns a detailed match analysis with score and recommendations.
   */
  async match(jobAnalysis, resumeProfile) {
    console.log("🔍 CandidateMatchingAgent: Comparing resume against job...");
    console.log(`  📋 Job: ${jobAnalysis.title} at ${jobAnalysis.company}`);
    console.log(`  👤 Candidate: ${resumeProfile.name}`);

    const systemPrompt = `You are a career advisor and ATS (Applicant Tracking System) expert. Compare a candidate's parsed resume against a job description and provide a comprehensive match analysis.

Return ONLY valid JSON with these fields:
- "matchScore": number 0-100 - Overall match percentage
- "matchingSkills": string[] - Skills the candidate has that match the job requirements
- "missingSkills": string[] - Skills required by the job that the candidate lacks
- "strengths": string[] - Candidate's strongest selling points for this specific role (max 5)
- "weaknesses": string[] - Areas where the candidate falls short for this role (max 4)
- "relevantProjects": string[] - Names of candidate's projects most relevant to this role
- "relevantExperience": string[] - Candidate's experience items most relevant to this role
- "recommendation": string - A 2-3 sentence recommendation on how the candidate should position themselves in their application

Scoring guide:
- 90-100: Excellent match, exceeds most requirements
- 75-89: Strong match, meets core requirements well
- 60-74: Good match, meets many requirements with some gaps
- 40-59: Moderate match, significant skill gaps but potential
- 20-39: Weak match, major misalignment
- 0-19: Poor match, not suitable

Be honest, specific, and constructive. Reference actual skills and projects from the resume.`;

    const userPrompt = `Compare this candidate against the job:

JOB DESCRIPTION:
Title: ${jobAnalysis.title}
Company: ${jobAnalysis.company}
Location: ${jobAnalysis.location}
Type: ${jobAnalysis.jobType}
Required Skills: ${jobAnalysis.skills?.join(", ") || "Not specified"}
Experience Required: ${jobAnalysis.experienceRequired || "Not specified"}
Responsibilities: ${jobAnalysis.responsibilities?.join("; ") || "Not specified"}
Qualifications: ${jobAnalysis.qualifications?.join("; ") || "Not specified"}
Keywords: ${jobAnalysis.keywords?.join(", ") || "Not specified"}
Description: ${jobAnalysis.description || "Not specified"}

CANDIDATE PROFILE:
Name: ${resumeProfile.name}
Skills: ${resumeProfile.skills?.join(", ") || "None listed"}
Education: ${resumeProfile.education?.map((e) => `${e.degree} from ${e.institution} (${e.year})`).join("; ") || "Not specified"}
Experience: ${resumeProfile.experience?.map((e) => `${e.role} at ${e.company} (${e.duration})`).join("; ") || "No experience listed"}
Projects: ${resumeProfile.projects?.map((p) => `${p.name}: ${p.description} [${p.techStack?.join(", ")}]`).join("; ") || "No projects listed"}
Achievements: ${resumeProfile.achievements?.join("; ") || "None listed"}
Hackathons: ${resumeProfile.hackathons?.join("; ") || "None listed"}
Certifications: ${resumeProfile.certifications?.join("; ") || "None listed"}

Return ONLY valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for candidate matching");
    }

    const parsed = JSON.parse(result);

    const analysis = {
      matchScore: Math.min(100, Math.max(0, parsed.matchScore || 0)),
      matchingSkills: parsed.matchingSkills || [],
      missingSkills: parsed.missingSkills || [],
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      relevantProjects: parsed.relevantProjects || [],
      relevantExperience: parsed.relevantExperience || [],
      recommendation: parsed.recommendation || "",
    };

    console.log(`  ✅ Match score: ${analysis.matchScore}/100`);
    console.log(`     Matching: ${analysis.matchingSkills.length} skills | Missing: ${analysis.missingSkills.length} skills`);

    return analysis;
  }
}
