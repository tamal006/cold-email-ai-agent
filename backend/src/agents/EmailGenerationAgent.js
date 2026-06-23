import OpenAI from "openai";
import { env } from "../config/env.js";
import { EmailScoringAgent } from "./EmailScoringAgent.js";

const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export class EmailGenerationAgent {
  scorer;

  constructor() {
    this.scorer = new EmailScoringAgent();
  }

  /**
   * Generate a personalized job application email using all available context.
   * Never invents information — only uses data from resume, job analysis, and user inputs.
   */
  async generate(input) {
    console.log("✉️  EmailGenerationAgent: Generating personalized application email...");

    const { jobAnalysis, resumeProfile, matchAnalysis, userSummary, userInstructions } = input;

    const systemPrompt = `You are an expert job application email writer. You craft highly personalized, compelling cold emails that get interviews.

You must return ONLY valid JSON with these fields:
- "subject": string - A compelling subject line (max 70 chars)
- "content": string - The plain text email body
- "htmlContent": string - The same email formatted in clean HTML with proper paragraphs and formatting

CRITICAL RULES:
1. NEVER invent or fabricate information. Only use data provided from the resume and job description.
2. Mention SPECIFIC skills from the candidate's resume that match the job requirements.
3. Reference SPECIFIC projects from the candidate's resume that are relevant to the role.
4. Mention achievements, hackathons, or certifications ONLY if they exist in the resume data.
5. Include education context if relevant to the role.
6. Highlight WHY the candidate fits this specific role — make it deeply personalized.
7. Include a strong but professional call-to-action.
8. Keep the email between 150-300 words.
9. Sound authentic and human — not template-like.
10. Start with a strong, personalized opening line — not "Dear Sir/Madam" or "To Whom It May Concern".
11. Reference the company name and role title naturally.
12. If the user provided a personal summary or instructions, incorporate them naturally.`;

    const userPrompt = `Generate a job application email with the following context:

JOB DETAILS:
Title: ${jobAnalysis.title}
Company: ${jobAnalysis.company}
Location: ${jobAnalysis.location}
Required Skills: ${jobAnalysis.skills?.join(", ") || "Not specified"}
Experience Required: ${jobAnalysis.experienceRequired || "Not specified"}
Key Responsibilities: ${jobAnalysis.responsibilities?.slice(0, 5).join("; ") || "Not specified"}
Description: ${jobAnalysis.description || "Not specified"}

CANDIDATE PROFILE:
Name: ${resumeProfile.name}
Skills: ${resumeProfile.skills?.join(", ") || "Not listed"}
Education: ${resumeProfile.education?.map((e) => `${e.degree} from ${e.institution} (${e.year})`).join("; ") || "Not specified"}
Experience: ${resumeProfile.experience?.map((e) => `${e.role} at ${e.company} (${e.duration}): ${e.description}`).join("; ") || "No experience"}
Projects: ${resumeProfile.projects?.map((p) => `${p.name}: ${p.description} [${p.techStack?.join(", ")}]`).join("; ") || "No projects"}
Achievements: ${resumeProfile.achievements?.join("; ") || "None"}
Hackathons: ${resumeProfile.hackathons?.join("; ") || "None"}
Certifications: ${resumeProfile.certifications?.join("; ") || "None"}
GitHub: ${resumeProfile.github || "Not provided"}
LinkedIn: ${resumeProfile.linkedin || "Not provided"}
Portfolio: ${resumeProfile.portfolio || "Not provided"}

MATCH ANALYSIS:
Match Score: ${matchAnalysis.matchScore}%
Matching Skills: ${matchAnalysis.matchingSkills?.join(", ") || "None"}
Strengths: ${matchAnalysis.strengths?.join("; ") || "None identified"}
Relevant Projects: ${matchAnalysis.relevantProjects?.join(", ") || "None identified"}

${userSummary ? `USER SUMMARY:\n${userSummary}` : ""}
${userInstructions ? `USER INSTRUCTIONS:\n${userInstructions}` : ""}

Return ONLY valid JSON with "subject", "content", and "htmlContent" fields.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for email generation");
    }

    const parsed = JSON.parse(result);
    if (!parsed.subject || !parsed.content) {
      throw new Error("Invalid email generated: missing subject or content");
    }

    console.log(`  ✅ Email generated: "${parsed.subject}"`);
    return parsed;
  }

  /**
   * Full pipeline: generate email + score quality + generate subject alternatives.
   * Retries up to 3 times if quality is below threshold.
   */
  async run(input) {
    console.log("🤖 EmailGenerationAgent: Starting email generation pipeline...");

    const maxAttempts = 3;
    let attempts = 0;
    let bestResult = null;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`\n📝 Attempt ${attempts}/${maxAttempts}`);

      // Generate
      const generated = await this.generate(input);

      // Score
      console.log("  → Scoring quality...");
      const scores = await this.scorer.score(generated.subject, generated.content);
      console.log(`  📊 Overall Score: ${scores.overallScore}/100`);

      const result = {
        subject: generated.subject,
        content: generated.content,
        htmlContent: generated.htmlContent,
        qualityScores: scores,
        attempts,
      };

      if (!bestResult || result.qualityScores.overallScore > bestResult.qualityScores.overallScore) {
        bestResult = result;
      }

      if (scores.overallScore >= 70) {
        console.log("  ✅ Quality check passed!");
        break;
      } else {
        console.log(
          `  ⚠️ Quality below threshold (${scores.overallScore}/100). ${attempts < maxAttempts ? "Regenerating..." : "Using best attempt."}`
        );
      }
    }

    if (!bestResult) {
      throw new Error("Failed to generate email after maximum attempts");
    }

    // Generate alternative subject lines
    console.log("\n📌 Generating alternative subject lines...");
    try {
      bestResult.subjectOptions = await this.generateSubjectLines(
        bestResult.content,
        input.jobAnalysis,
        input.resumeProfile
      );
      console.log(`  ✅ Generated ${bestResult.subjectOptions.length} alternative subjects`);
    } catch (error) {
      console.error("  ⚠️ Subject generation failed, using primary only");
      bestResult.subjectOptions = [bestResult.subject];
    }

    console.log("\n🎉 Email generation pipeline complete!");
    return bestResult;
  }

  /**
   * Generate 5 alternative subject line options.
   */
  async generateSubjectLines(emailContent, jobAnalysis, resumeProfile) {
    const systemPrompt = `You are an email subject line expert. Generate 5 compelling subject line options for a job application email.
Return ONLY valid JSON with a single field "subjects" containing an array of exactly 5 strings.

Guidelines:
- Keep each subject line under 70 characters
- Make them specific to the role and company
- Vary approaches: direct application, value-proposition, personalized, achievement-driven, concise
- Include the job title or company name in at least 3 of them
- Avoid generic phrases like "Application for Position"`;

    const userPrompt = `Generate 5 subject lines for an application email:

Job: ${jobAnalysis.title} at ${jobAnalysis.company}
Candidate: ${resumeProfile.name}
Key Skills: ${resumeProfile.skills?.slice(0, 5).join(", ") || "Not listed"}

Email content:
${emailContent.substring(0, 1500)}

Return ONLY valid JSON with "subjects" array.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) return [];

    const parsed = JSON.parse(result);
    return parsed.subjects || [];
  }
}
