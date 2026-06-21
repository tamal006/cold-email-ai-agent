import OpenAI from "openai";
import { env } from "../config/env.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class SubjectOptimizerTool {
  async optimize(currentSubject, emailContent, purpose) {
    const systemPrompt = `You are an email subject line optimization expert. Generate 5 alternative subject lines that would maximize open rates.
Return ONLY valid JSON with a single field "subjects" containing an array of exactly 5 strings.

Guidelines:
- Keep each subject line under 60 characters
- Make them compelling and curiosity-inducing
- Avoid spam trigger words
- Vary the approaches (question, statement, personalized, benefit-driven, urgency)
- Make them relevant to the email content and purpose`;
    const userPrompt = `Current subject line: "${currentSubject}"
Purpose: ${purpose}

Email content:
${emailContent}

Generate 5 alternative subject lines. Return ONLY valid JSON with "subjects" array.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 400,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from Groq for subject optimization");
    }
    const parsed = JSON.parse(result);
    return parsed.subjects || [];
  }
}
