import OpenAI from "openai";
import { env } from "../config/env.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class ResumeMatchingAgent {
  async match(input) {
    console.log("\u{1F4C4} ResumeMatchingAgent: Matching resume against job...");
    console.log(`\u{1F4BC} Job: ${input.jobTitle}`);
    const systemPrompt = `You are a career advisor and ATS (Applicant Tracking System) expert. Compare a candidate's resume/profile against a job description and provide detailed matching analysis.

Return ONLY valid JSON with these fields:
- "matchScore": number 0-100 - Overall match percentage
- "matchingSkills": string[] - Skills the candidate already has that match the job
- "missingSkills": string[] - Skills required by the job that the candidate lacks
- "recommendedImprovements": string[] - Specific improvements the candidate should make (max 5)
- "suggestedProjects": string[] - Project ideas that would strengthen the candidate's profile for this role (max 3)
- "suggestedKeywords": string[] - ATS-friendly keywords the candidate should add to their resume
- "summary": string - 2-3 sentence summary of the match assessment

Scoring guide:
- 90-100: Excellent match, strongly qualified
- 70-89: Good match, meets most requirements
- 50-69: Moderate match, some gaps
- 30-49: Partial match, significant gaps
- 0-29: Weak match, major skill misalignment

Be honest and constructive in your assessment.`;
    const userPrompt = `Match this candidate against the job:

JOB:
Title: ${input.jobTitle}
Description: ${input.jobDescription.substring(0, 2e3)}
Required Skills: ${input.jobSkills.join(", ")}
Experience Required: ${input.jobExperience}

CANDIDATE:
${input.resumeText ? `Resume/Profile:
${input.resumeText.substring(0, 3e3)}` : "No resume text provided."}
${input.userSkills?.length ? `Listed Skills: ${input.userSkills.join(", ")}` : ""}
${input.userExperience ? `Experience: ${input.userExperience}` : ""}

Return ONLY valid JSON.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for resume matching");
    }
    const parsed = JSON.parse(result);
    console.log(`  \u2705 Match score: ${parsed.matchScore}/100`);
    return {
      matchScore: Math.min(100, Math.max(0, parsed.matchScore || 0)),
      matchingSkills: parsed.matchingSkills || [],
      missingSkills: parsed.missingSkills || [],
      recommendedImprovements: parsed.recommendedImprovements || [],
      suggestedProjects: parsed.suggestedProjects || [],
      suggestedKeywords: parsed.suggestedKeywords || [],
      summary: parsed.summary || ""
    };
  }
}
