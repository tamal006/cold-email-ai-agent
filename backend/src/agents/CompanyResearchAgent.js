import OpenAI from "openai";
import { env } from "../config/env.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class CompanyResearchAgent {
  async research(companyName, jobTitle) {
    console.log("\u{1F3E2} CompanyResearchAgent: Researching company...");
    console.log(`\u{1F4CB} Company: ${companyName}`);
    const systemPrompt = `You are a company research analyst. Given a company name, provide detailed intelligence about the company based on your training knowledge.
Return ONLY valid JSON with these fields:
- "name": string - Company name
- "website": string or null - Company website URL (if known)
- "industry": string - Primary industry
- "products": string[] - Key products (max 5)
- "services": string[] - Key services (max 5)
- "companySize": string - Approximate size (e.g., "1000-5000 employees", "Startup", "Enterprise")
- "recentNews": string[] - Recent notable activities or news you know about (max 3, only factual things you are confident about)
- "techStack": string[] - Known technology stack (if tech company)
- "hiringActivity": string - General hiring activity description
- "culture": string - Brief company culture description
- "mission": string - Company mission or vision statement if known
- "insightSummary": string - A 3-4 sentence summary useful for personalizing outreach. Include what makes this company unique, their focus areas, and any notable achievements.

IMPORTANT:
- Only include information you are confident about
- If you don't know something, use null for strings and empty arrays for lists
- Do NOT fabricate specific statistics, revenue figures, or dates you're unsure about
- For recentNews, only include things you are confident are factual`;
    const userPrompt = `Research this company and provide detailed intelligence:

Company: ${companyName}
${jobTitle ? `Context: Researching for a "${jobTitle}" position` : ""}

Return ONLY valid JSON.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.4,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for company research");
    }
    const parsed = JSON.parse(result);
    console.log(`  \u2705 Research complete: ${parsed.industry || "Unknown industry"}`);
    return {
      name: parsed.name || companyName,
      website: parsed.website || void 0,
      industry: parsed.industry || void 0,
      products: parsed.products || [],
      services: parsed.services || [],
      companySize: parsed.companySize || void 0,
      recentNews: parsed.recentNews || [],
      techStack: parsed.techStack || [],
      hiringActivity: parsed.hiringActivity || void 0,
      culture: parsed.culture || void 0,
      mission: parsed.mission || void 0,
      insightSummary: parsed.insightSummary || ""
    };
  }
}
