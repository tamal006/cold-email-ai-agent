import OpenAI from "openai";
import { env } from "../config/env.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class PersonalizationEngine {
  async personalize(context) {
    console.log("\u2728 PersonalizationEngine: Generating personalized elements...");
    const systemPrompt = `You are an expert at writing personalized professional communications. Generate specific personalization elements for a job outreach message.

Return ONLY valid JSON with these fields:
- "personalizedOpening": string - A warm, personalized opening line that references the contact's role or the company (1-2 sentences)
- "companyReference": string - A specific, factual reference to the company's work, mission, product, or recent activity (1 sentence). Only mention things that are true.
- "roleConnection": string - How the sender's background connects to the target role (1 sentence)
- "valueProposition": string - What unique value the sender brings (1 sentence)
- "callToAction": string - A specific, non-pushy call to action (1 sentence)

IMPORTANT:
- Never invent facts about the company or contact
- Keep each element concise and natural-sounding
- Avoid clich\xE9s like "I'm passionate about..." or "I'd love to..."
- Be specific, not generic
- Reference real skills and experiences from the sender's background`;
    const userPrompt = `Generate personalization elements for this outreach:

Contact: ${context.contactName} (${context.contactRole})
Company: ${context.companyName}
${context.companyMission ? `Company Mission: ${context.companyMission}` : ""}
${context.companyProducts?.length ? `Company Products: ${context.companyProducts.join(", ")}` : ""}
${context.companyInsight ? `Company Insight: ${context.companyInsight}` : ""}
Job: ${context.jobTitle}
Required Skills: ${context.jobSkills.join(", ")}

Sender: ${context.userName}
${context.userHeadline ? `Headline: ${context.userHeadline}` : ""}
${context.userSkills?.length ? `Skills: ${context.userSkills.join(", ")}` : ""}
${context.userExperience ? `Experience: ${context.userExperience}` : ""}
${context.userAchievements?.length ? `Achievements: ${context.userAchievements.join("; ")}` : ""}

Return ONLY valid JSON.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for personalization");
    }
    const parsed = JSON.parse(result);
    console.log("  \u2705 Personalization elements generated");
    return {
      personalizedOpening: parsed.personalizedOpening || "",
      companyReference: parsed.companyReference || "",
      roleConnection: parsed.roleConnection || "",
      valueProposition: parsed.valueProposition || "",
      callToAction: parsed.callToAction || ""
    };
  }
}
