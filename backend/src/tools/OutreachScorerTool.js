import OpenAI from "openai";
import { env } from "../config/env.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class OutreachScorerTool {
  async score(subject, content, outreachType, contactRole) {
    const systemPrompt = `You are an email deliverability and outreach quality expert. Analyze the outreach message and score it on multiple dimensions.

Return ONLY valid JSON with these fields:
- "spamScore": number 0-100 - Likelihood of avoiding spam filters (100 = definitely not spam)
- "professionalismScore": number 0-100 - How professional the message sounds
- "personalizationScore": number 0-100 - How personalized and non-generic the message feels
- "grammarScore": number 0-100 - Grammar and writing quality
- "predictedResponseProbability": number 0-100 - Estimated probability of getting a response
- "feedback": string[] - Specific observations about the message (max 4)
- "improvements": string[] - Actionable improvement suggestions (max 3)

Scoring criteria:
- Spam: Check for trigger words, excessive punctuation, ALL CAPS, link-heavy content
- Professionalism: Tone, formatting, appropriate greeting/closing
- Personalization: Specific references, non-generic content, tailored messaging
- Grammar: Spelling, punctuation, sentence structure
- Response probability: Based on all factors plus message length, CTA clarity, relevance to recipient`;
    const userPrompt = `Score this outreach message:

Type: ${outreachType}
Target: ${contactRole}
Subject: ${subject}

Message:
${content}

Return ONLY valid JSON.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for outreach scoring");
    }
    const parsed = JSON.parse(result);
    const scores = {
      spamScore: Math.min(100, Math.max(0, parsed.spamScore || 0)),
      professionalismScore: Math.min(100, Math.max(0, parsed.professionalismScore || 0)),
      personalizationScore: Math.min(100, Math.max(0, parsed.personalizationScore || 0)),
      grammarScore: Math.min(100, Math.max(0, parsed.grammarScore || 0)),
      predictedResponseProbability: Math.min(100, Math.max(0, parsed.predictedResponseProbability || 0)),
      overallScore: 0,
      feedback: parsed.feedback || [],
      improvements: parsed.improvements || []
    };
    scores.overallScore = Math.round(
      scores.spamScore * 0.15 + scores.professionalismScore * 0.25 + scores.personalizationScore * 0.25 + scores.grammarScore * 0.15 + scores.predictedResponseProbability * 0.2
    );
    return scores;
  }
}
