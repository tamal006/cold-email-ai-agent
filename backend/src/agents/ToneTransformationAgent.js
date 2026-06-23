import OpenAI from "openai";
import { env } from "../config/env.js";

const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SUPPORTED_TONES = [
  "professional",
  "friendly",
  "formal",
  "confident",
  "enthusiastic",
  "corporate",
  "startup",
  "minimal",
  "recruiter-friendly",
];

export class ToneTransformationAgent {
  /**
   * Rewrite an email in a different tone while preserving the core content.
   *
   * @param {string} emailContent - Current email content (plain text)
   * @param {string} currentSubject - Current subject line
   * @param {string} targetTone - Target tone from SUPPORTED_TONES
   * @returns {object} - { subject, content, htmlContent }
   */
  async transform(emailContent, currentSubject, targetTone) {
    if (!SUPPORTED_TONES.includes(targetTone)) {
      throw new Error(`Unsupported tone: ${targetTone}. Supported: ${SUPPORTED_TONES.join(", ")}`);
    }

    console.log(`🎨 ToneTransformationAgent: Transforming to "${targetTone}" tone...`);

    const toneDescriptions = {
      professional:
        "Polished, competent, and business-appropriate. Uses industry-standard language without being overly stiff.",
      friendly:
        "Warm, approachable, and conversational while remaining professional. Uses a natural, human voice.",
      formal:
        "Highly structured, courteous, and traditional business writing. Uses formal salutations and closing.",
      confident:
        "Bold, assertive, and self-assured. Emphasizes achievements directly without hedging language.",
      enthusiastic:
        "Energetic, passionate, and excited about the opportunity. Shows genuine eagerness without being over-the-top.",
      corporate:
        "Structured, strategic, and value-focused. Uses corporate language patterns and emphasizes ROI/impact.",
      startup:
        "Dynamic, innovative, and culture-aware. References growth mindset, hustle, and adaptability.",
      minimal:
        "Ultra-concise, direct, and no-fluff. Gets straight to the point with maximum impact in minimum words.",
      "recruiter-friendly":
        "Optimized for recruiter scanning. Clear structure, bullet-point highlights, and easy-to-parse format.",
    };

    const systemPrompt = `You are a professional writing tone specialist. Rewrite the given job application email in the specified tone.

CRITICAL RULES:
1. PRESERVE all factual content: skills, projects, achievements, company name, role title
2. PRESERVE the core message and purpose
3. ONLY change the writing style, word choice, and sentence structure
4. DO NOT add or invent any new information
5. Keep the email approximately the same length (±20%)
6. Update the subject line to match the new tone

Target Tone: "${targetTone}"
Tone Description: ${toneDescriptions[targetTone]}

Return ONLY valid JSON with these fields:
- "subject": string - Subject line matching the new tone
- "content": string - The rewritten plain text email body
- "htmlContent": string - The rewritten email in clean HTML`;

    const userPrompt = `Rewrite this job application email in a "${targetTone}" tone:

Subject: ${currentSubject}

Email:
${emailContent}

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
      throw new Error("No response from AI for tone transformation");
    }

    const parsed = JSON.parse(result);
    if (!parsed.content) {
      throw new Error("Invalid tone transformation: missing content");
    }

    console.log(`  ✅ Tone transformed to "${targetTone}"`);

    return {
      subject: parsed.subject || currentSubject,
      content: parsed.content,
      htmlContent: parsed.htmlContent || "",
    };
  }

  /**
   * Get the list of supported tones.
   */
  static getSupportedTones() {
    return SUPPORTED_TONES;
  }
}
