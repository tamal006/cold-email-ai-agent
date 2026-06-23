import OpenAI from "openai";
import { env } from "../config/env.js";

const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export class EmailScoringAgent {
  /**
   * Score an email on 6 quality dimensions.
   * Returns individual scores, overall score, and improvement suggestions.
   */
  async score(subject, content) {
    console.log("📊 EmailScoringAgent: Analyzing email quality...");

    const systemPrompt = `You are an email quality analyst specializing in job application emails. Evaluate the email on 6 dimensions and provide actionable improvement suggestions.

Return ONLY valid JSON with these fields:
- "professionalismScore": number 0-100 - How professional and appropriate the email sounds
- "personalizationScore": number 0-100 - How personalized and non-generic the email feels
- "grammarScore": number 0-100 - Grammar, spelling, and writing quality
- "readabilityScore": number 0-100 - How easy to read and understand
- "recruiterAppealScore": number 0-100 - How appealing this would be to a recruiter/hiring manager
- "ctaScore": number 0-100 - Strength and clarity of the call-to-action
- "suggestions": string[] - Specific, actionable improvement suggestions (max 5)

Scoring guide:
- 90-100: Exceptional quality
- 75-89: Strong quality, minor improvements possible
- 60-74: Good quality, some improvements needed
- 40-59: Average quality, significant improvements recommended
- 0-39: Below average, major rework suggested

Be thorough but fair. Consider:
- Spam trigger words (penalize)
- Template-sounding language (penalize)
- Specific references to role/company (reward)
- Clear call-to-action (reward)
- Appropriate length (150-300 words ideal)
- Professional but human tone (reward)`;

    const userPrompt = `Evaluate this job application email:

Subject: ${subject}

Body:
${content}

Return ONLY valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for email scoring");
    }

    const parsed = JSON.parse(result);

    const clamp = (val) => Math.min(100, Math.max(0, val || 0));

    const scores = {
      professionalismScore: clamp(parsed.professionalismScore),
      personalizationScore: clamp(parsed.personalizationScore),
      grammarScore: clamp(parsed.grammarScore),
      readabilityScore: clamp(parsed.readabilityScore),
      recruiterAppealScore: clamp(parsed.recruiterAppealScore),
      ctaScore: clamp(parsed.ctaScore),
      overallScore: 0,
      suggestions: parsed.suggestions || [],
    };

    // Weighted average for overall score
    scores.overallScore = Math.round(
      scores.professionalismScore * 0.2 +
        scores.personalizationScore * 0.25 +
        scores.grammarScore * 0.1 +
        scores.readabilityScore * 0.15 +
        scores.recruiterAppealScore * 0.2 +
        scores.ctaScore * 0.1
    );

    console.log(`  ✅ Overall: ${scores.overallScore}/100`);
    console.log(
      `     Prof: ${scores.professionalismScore} | Pers: ${scores.personalizationScore} | Gram: ${scores.grammarScore} | Read: ${scores.readabilityScore} | Recr: ${scores.recruiterAppealScore} | CTA: ${scores.ctaScore}`
    );

    return scores;
  }
}
