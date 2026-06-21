import OpenAI from "openai";
import { env } from "../config/env.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class EmailGeneratorTool {
  async generate(input) {
    const systemPrompt = `You are an expert cold email writer with years of experience crafting emails that get responses. 
You write personalized, compelling cold emails that are concise, professional, and effective.
You must return ONLY valid JSON with exactly these fields: "subject", "content", "htmlContent".
- "subject": A compelling subject line (max 60 chars)
- "content": The plain text email body
- "htmlContent": The same email formatted in clean HTML with proper paragraphs

Guidelines:
- Keep emails between 100-250 words
- Use the recipient's name if provided
- Reference the company if provided
- Match the requested tone exactly
- Include a clear call-to-action
- Avoid spam trigger words (free, guarantee, act now, limited time, etc.)
- Be authentic and human-sounding
- Don't use excessive exclamation marks
- Start with a personalized opening, not generic greetings`;
    const userPrompt = `Generate a cold email with the following details:

Recipient Email: ${input.recipientEmail}
${input.recipientName ? `Recipient Name: ${input.recipientName}` : ""}
${input.companyName ? `Company: ${input.companyName}` : ""}
${input.jobPosition ? `Job Position: ${input.jobPosition}` : ""}
Purpose: ${input.purpose}
${input.userBackground ? `About the Sender: ${input.userBackground}` : ""}
${input.additionalNotes ? `Additional Notes: ${input.additionalNotes}` : ""}
Tone: ${input.tone}

Return ONLY valid JSON with "subject", "content", and "htmlContent" fields.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from Groq");
    }
    const parsed = JSON.parse(result);
    if (!parsed.subject || !parsed.content) {
      throw new Error("Invalid email generated: missing subject or content");
    }
    return parsed;
  }
}
