import OpenAI from "openai";
import { env } from "../config/env.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class EmailValidatorTool {
  async validate(subject, content) {
    const systemPrompt = `You are an email quality analyst. Evaluate the cold email and return ONLY valid JSON with these fields:
- "grammar": score 0-100 for grammar and spelling quality
- "readability": score 0-100 for readability and clarity
- "professionalism": score 0-100 for professionalism and appropriateness
- "spamScore": score 0-100 where 100 means NO spam words detected (higher is better)
- "lengthScore": score 0-100 for appropriate length (100-250 words is ideal)
- "feedback": array of strings with specific issues found
- "suggestions": array of strings with improvement suggestions

Be strict but fair. Penalize:
- Spam trigger words (free, guarantee, act now, limited time, click here)
- Excessive caps or exclamation marks
- Too short (<80 words) or too long (>300 words) emails
- Generic or template-sounding content
- Weak or missing call-to-action
- Poor grammar or spelling`;
    const userPrompt = `Evaluate this cold email:

Subject: ${subject}

Body:
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
      throw new Error("No response from Groq for validation");
    }
    const parsed = JSON.parse(result);
    const score = Math.round(
      (parsed.grammar + parsed.readability + parsed.professionalism + parsed.spamScore + parsed.lengthScore) / 5
    );
    return {
      score,
      grammar: parsed.grammar,
      readability: parsed.readability,
      professionalism: parsed.professionalism,
      spamScore: parsed.spamScore,
      lengthScore: parsed.lengthScore,
      feedback: parsed.feedback || [],
      suggestions: parsed.suggestions || [],
      passesQuality: score >= 70
    };
  }
}
