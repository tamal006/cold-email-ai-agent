import OpenAI from "openai";
import { env } from "../config/env.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class ContactRankingAgent {
  async rank(contacts, jobTitle, skills, companyName) {
    console.log("\u{1F4CA} ContactRankingAgent: Ranking contacts...");
    if (contacts.length === 0) {
      return [];
    }
    const systemPrompt = `You are a hiring process expert. Rank and score the provided contacts based on their relevance for a job seeker applying to a specific position.

Return ONLY valid JSON with a "rankedContacts" array. Each object should have:
- "index": number - The 0-based index of the contact from the input list
- "relevanceScore": number 0-100 - How relevant this contact is for the job seeker
- "rankReason": string - Brief explanation of why this contact is ranked here (1 sentence)

Scoring criteria:
- Hiring relevance (40%): How directly involved this person would be in hiring decisions
- Role seniority (20%): Senior enough to make referral decisions but not too senior to be unreachable
- Department match (25%): How closely their department matches the target role
- Job relevance (15%): How well this contact aligns with the specific job requirements

Order from highest relevanceScore to lowest.`;
    const contactSummaries = contacts.map(
      (c, i) => `${i}. ${c.fullName} - ${c.role} (${c.department}) [confidence: ${c.confidenceScore}]`
    ).join("\n");
    const userPrompt = `Rank these contacts for a job seeker applying to:

Position: ${jobTitle}
Company: ${companyName}
Key Skills: ${skills.join(", ")}

Contacts:
${contactSummaries}

Return ONLY valid JSON with "rankedContacts" array.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1e3,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for contact ranking");
    }
    const parsed = JSON.parse(result);
    const rankedContacts = (parsed.rankedContacts || []).filter((r) => r.index >= 0 && r.index < contacts.length).map((r) => ({
      ...contacts[r.index],
      relevanceScore: Math.min(100, Math.max(0, r.relevanceScore || 50)),
      rankReason: r.rankReason || ""
    }));
    const rankedIndices = new Set((parsed.rankedContacts || []).map((r) => r.index));
    contacts.forEach((contact, i) => {
      if (!rankedIndices.has(i)) {
        rankedContacts.push({
          ...contact,
          relevanceScore: 30,
          rankReason: "Not specifically ranked"
        });
      }
    });
    console.log(`  \u2705 Ranked ${rankedContacts.length} contacts`);
    return rankedContacts;
  }
}
