import OpenAI from "openai";
import { env } from "../config/env.js";
import { PersonalizationEngine } from "./PersonalizationEngine.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class OutreachAgent {
  personalizationEngine;
  constructor() {
    this.personalizationEngine = new PersonalizationEngine();
  }
  async generate(input) {
    console.log("\u{1F4DD} OutreachAgent: Generating personalized outreach...");
    console.log(`\u{1F4E7} Type: ${input.outreachType}`);
    console.log(`\u{1F464} Contact: ${input.contactName} at ${input.companyName}`);
    const personalizationContext = {
      contactName: input.contactName,
      contactRole: input.contactRole,
      companyName: input.companyName,
      companyMission: input.companyMission,
      companyProducts: input.companyProducts,
      companyInsight: input.companyInsight,
      jobTitle: input.jobTitle,
      jobSkills: input.jobSkills,
      userName: input.userName,
      userHeadline: input.userHeadline,
      userSkills: input.userSkills,
      userExperience: input.userExperience,
      userAchievements: input.userAchievements
    };
    let personalization;
    try {
      personalization = await this.personalizationEngine.personalize(personalizationContext);
    } catch (error) {
      console.log("  \u26A0\uFE0F Personalization failed, generating without it");
      personalization = null;
    }
    const outreach = await this.generateMessages(input, personalization);
    console.log("  \u2705 All outreach messages generated");
    return outreach;
  }
  async generateMessages(input, personalization) {
    const outreachTypeLabels = {
      referral_request: "Referral Request",
      internship_request: "Internship Request",
      job_application: "Job Application Introduction",
      networking: "Networking Request",
      follow_up: "Follow-Up Message"
    };
    const systemPrompt = `You are an expert at writing professional outreach messages for job seekers. Generate multiple types of messages for the given context.

Return ONLY valid JSON with these fields:
- "subjectLine": string - Email subject line (max 60 chars, compelling, no spam words)
- "coldEmail": string - Full cold email body (plain text, 150-250 words)
- "coldEmailHtml": string - Same email in clean HTML with <p> tags
- "linkedinMessage": string - LinkedIn connection request message (max 300 chars)
- "linkedinFollowUp": string - LinkedIn follow-up message after connecting (100-150 words)
- "referralRequestEmail": string - Formal referral request email (150-200 words)
- "referralRequestEmailHtml": string - Same in HTML
- "shortNetworkingMessage": string - Brief networking message (50-80 words)

Guidelines:
- The outreach type is "${outreachTypeLabels[input.outreachType]}" \u2014 tailor the tone accordingly
- Be professional but warm and human
- Avoid spam words (free, guarantee, act now, limited time)
- Include a clear, non-pushy call-to-action
- Reference specific skills and experiences
- Keep messages concise and scannable
- Never make false claims about the sender
- Use the personalization elements provided (if any)
- The sender's name is "${input.userName}"`;
    const userPrompt = `Generate outreach messages with these details:

Type: ${outreachTypeLabels[input.outreachType]}
Contact: ${input.contactName} (${input.contactRole})
Company: ${input.companyName}
Position: ${input.jobTitle}
Required Skills: ${input.jobSkills.join(", ")}
${input.jobDescription ? `Job Summary: ${input.jobDescription.substring(0, 300)}` : ""}

Sender: ${input.userName}
${input.userHeadline ? `Headline: ${input.userHeadline}` : ""}
${input.userSkills?.length ? `Skills: ${input.userSkills.join(", ")}` : ""}
${input.userExperience ? `Experience: ${input.userExperience}` : ""}
${input.userAchievements?.length ? `Achievements: ${input.userAchievements.join("; ")}` : ""}

${personalization ? `
Personalization Elements:
- Opening: ${personalization.personalizedOpening}
- Company Reference: ${personalization.companyReference}
- Role Connection: ${personalization.roleConnection}
- Value Proposition: ${personalization.valueProposition}
- CTA: ${personalization.callToAction}
` : ""}

${input.additionalInstructions ? `Additional Instructions: ${input.additionalInstructions}` : ""}

Return ONLY valid JSON.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3e3,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for outreach generation");
    }
    const parsed = JSON.parse(result);
    return {
      subjectLine: parsed.subjectLine || `Regarding ${input.jobTitle} opportunity`,
      coldEmail: parsed.coldEmail || "",
      coldEmailHtml: parsed.coldEmailHtml || `<p>${parsed.coldEmail || ""}</p>`,
      linkedinMessage: parsed.linkedinMessage || "",
      linkedinFollowUp: parsed.linkedinFollowUp || "",
      referralRequestEmail: parsed.referralRequestEmail || "",
      referralRequestEmailHtml: parsed.referralRequestEmailHtml || `<p>${parsed.referralRequestEmail || ""}</p>`,
      shortNetworkingMessage: parsed.shortNetworkingMessage || ""
    };
  }
}
