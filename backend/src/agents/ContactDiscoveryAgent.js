import OpenAI from "openai";
import { env } from "../config/env.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class ContactDiscoveryAgent {
  async discover(companyName, jobTitle, companyWebsite) {
    console.log("\u{1F465} ContactDiscoveryAgent: Discovering contacts...");
    console.log(`\u{1F3E2} Company: ${companyName}`);
    console.log(`\u{1F4BC} Role: ${jobTitle}`);
    const systemPrompt = `You are a professional networking assistant. Given a company and job role, suggest the types of people a job seeker should reach out to for referrals and introductions.

Return ONLY valid JSON with a "contacts" array. Each contact object should have:
- "fullName": string - A realistic suggested name placeholder (e.g., "Hiring Manager at [Company]") OR a known public figure at the company if you are VERY confident
- "role": string - The role/title of this contact type
- "department": string - Department (e.g., "Human Resources", "Engineering", "Talent Acquisition")
- "profileUrl": string or null - Only include if you know a REAL public URL (company team page, etc). Do NOT make up LinkedIn URLs.
- "sourceUrl": string or null - Where this contact info might be found (e.g., company careers page URL)
- "email": string or null - Only include a REAL publicly available email. NEVER guess or fabricate email addresses.
- "emailStatus": "available" or "not_publicly_available"
- "confidenceScore": number 0-100 - How confident you are this type of contact exists at the company
- "isSuggested": boolean - true if this is a suggested contact type rather than a specific person

IMPORTANT RULES:
1. Generate 5-8 contact suggestions
2. Mix of specific roles: Recruiter, Hiring Manager, Team Lead, HR, Engineering Manager
3. NEVER fabricate email addresses or LinkedIn URLs
4. Set emailStatus to "not_publicly_available" unless you have a REAL public email
5. Set isSuggested to true for suggested contact types
6. Only set isSuggested to false if you are very confident about a specific real person
7. Include where the user might find these contacts (e.g., "Check company careers page", "Search LinkedIn for...")
8. Order by hiring relevance (most relevant first)`;
    const userPrompt = `Find relevant contacts at this company for a job seeker:

Company: ${companyName}
Job Position: ${jobTitle}
${companyWebsite ? `Company Website: ${companyWebsite}` : ""}

Remember: NEVER fabricate emails or profile URLs. Suggest contact types the job seeker should look for.

Return ONLY valid JSON with a "contacts" array.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 2e3,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for contact discovery");
    }
    const parsed = JSON.parse(result);
    const contacts = (parsed.contacts || []).map((c) => ({
      fullName: c.fullName || "Unknown Contact",
      role: c.role || "Unknown Role",
      department: c.department || "General",
      profileUrl: c.profileUrl || void 0,
      sourceUrl: c.sourceUrl || void 0,
      email: c.email || void 0,
      emailStatus: c.email ? "available" : "not_publicly_available",
      confidenceScore: Math.min(100, Math.max(0, c.confidenceScore || 50)),
      isSuggested: c.isSuggested !== false
    }));
    console.log(`  \u2705 Discovered ${contacts.length} contacts`);
    return contacts;
  }
}
