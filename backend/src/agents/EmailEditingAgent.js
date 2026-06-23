import OpenAI from "openai";
import { env } from "../config/env.js";

const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export class EmailEditingAgent {
  /**
   * Edit an existing email based on a user instruction.
   * Maintains conversation context for multi-turn editing.
   *
   * @param {string} currentEmail - The current email content (plain text)
   * @param {string} currentSubject - The current subject line
   * @param {string} instruction - The user's edit instruction
   * @param {Array} chatHistory - Previous edit conversation messages
   * @param {object} context - Original job/resume context for reference
   * @returns {object} - { subject, content, htmlContent }
   */
  async edit(currentEmail, currentSubject, instruction, chatHistory = [], context = {}) {
    console.log("✏️  EmailEditingAgent: Processing edit instruction...");
    console.log(`  💬 "${instruction}"`);

    const systemPrompt = `You are an AI email editor. The user has a job application email and wants to make changes to it.

Your job is to modify the email according to the user's instruction while:
1. Preserving the core message and purpose (job application)
2. Keeping all factual information accurate (skills, projects, achievements)
3. Maintaining professional formatting
4. NOT inventing new information that wasn't in the original email or context

You must return ONLY valid JSON with these fields:
- "subject": string - The updated subject line (keep unchanged unless the user asks to change it)
- "content": string - The updated plain text email body
- "htmlContent": string - The updated email formatted in clean HTML
- "changeDescription": string - A brief description of what was changed (1 sentence)

Common edit instructions you should handle:
- "Make this shorter" → Condense while keeping key points
- "Make this longer" → Expand with more detail from the context
- "More confident" → Adjust tone to be more assertive
- "More humble" → Soften the language
- "Mention my [achievement]" → Add the achievement naturally
- "Remove the [section]" → Remove that section
- "Focus more on [topic]" → Emphasize that area
- "Improve grammar" → Fix grammar and polish writing
- "Make it more human-like" → Remove template-sounding phrases
- "Make more professional" → Elevate the formal tone`;

    // Build conversation messages
    const messages = [{ role: "system", content: systemPrompt }];

    // Add chat history for context continuity
    for (const msg of chatHistory.slice(-6)) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Add the current edit request
    const contextInfo = context.jobTitle
      ? `\nJob Context: ${context.jobTitle} at ${context.company}\nCandidate Skills: ${context.skills?.join(", ") || "Not available"}\nAchievements: ${context.achievements?.join("; ") || "Not available"}`
      : "";

    messages.push({
      role: "user",
      content: `Current email subject: "${currentSubject}"

Current email body:
${currentEmail}
${contextInfo}

User instruction: "${instruction}"

Apply the requested change and return ONLY valid JSON with "subject", "content", "htmlContent", and "changeDescription" fields.`,
    });

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.6,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for email editing");
    }

    const parsed = JSON.parse(result);
    if (!parsed.content) {
      throw new Error("Invalid edit response: missing content");
    }

    console.log(`  ✅ Edit applied: ${parsed.changeDescription || "Changes made"}`);

    return {
      subject: parsed.subject || currentSubject,
      content: parsed.content,
      htmlContent: parsed.htmlContent || "",
      changeDescription: parsed.changeDescription || "Email updated",
    };
  }
}
