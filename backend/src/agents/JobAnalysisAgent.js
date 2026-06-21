import OpenAI from "openai";
import { env } from "../config/env.js";
import { WebScraperTool } from "../tools/WebScraperTool.js";
const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
export class JobAnalysisAgent {
  scraper;
  constructor() {
    this.scraper = new WebScraperTool();
  }
  detectPlatform(url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("linkedin.com")) return "linkedin";
    if (lowerUrl.includes("naukri.com")) return "naukri";
    if (lowerUrl.includes("internshala.com")) return "internshala";
    if (lowerUrl.includes("/careers") || lowerUrl.includes("/jobs")) return "careers";
    return "other";
  }
  async analyze(url) {
    console.log("\u{1F50D} JobAnalysisAgent: Starting job analysis...");
    console.log(`\u{1F4CE} URL: ${url}`);
    const platform = this.detectPlatform(url);
    console.log(`\u{1F4F1} Detected platform: ${platform}`);
    let pageContent = "";
    try {
      console.log("  \u2192 Scraping public page content...");
      pageContent = await this.scraper.scrape(url);
      console.log(`  \u2705 Scraped ${pageContent.length} characters`);
    } catch (error) {
      console.log("  \u26A0\uFE0F Could not scrape page, will use URL analysis only");
      pageContent = `URL: ${url}`;
    }
    console.log("  \u2192 Analyzing job content with AI...");
    const analysis = await this.extractJobDetails(pageContent, url, platform);
    console.log(`  \u2705 Analysis complete: "${analysis.title}" at "${analysis.company}"`);
    return analysis;
  }
  async extractJobDetails(content, url, platform) {
    const systemPrompt = `You are a job posting analysis expert. Extract structured information from job posting content.
Return ONLY valid JSON with exactly these fields:
- "title": string - The job title
- "company": string - The company name
- "location": string - Job location (city, state, country, or "Remote")
- "salary": string or null - Salary range if mentioned
- "jobType": "remote" | "hybrid" | "onsite" | "unknown"
- "skills": string[] - Required technical and soft skills
- "responsibilities": string[] - Key job responsibilities (max 8 items)
- "experienceRequired": string - Experience level (e.g., "0-2 Years", "3-5 Years", "Senior")
- "keywords": string[] - Important keywords for this role (technologies, methodologies, domain terms)
- "description": string - A concise 2-3 sentence summary of the role
- "qualifications": string[] - Required qualifications and education
- "benefits": string[] - Listed benefits if any

Guidelines:
- Extract as much information as possible from the content
- If information is not available, use reasonable defaults: "Not specified" for strings, empty arrays for lists
- For skills, separate individual technologies (e.g., ["React", "TypeScript"] not ["React/TypeScript"])
- Keep responsibilities concise - one sentence each
- Extract the company name even from partial information in the URL`;
    const userPrompt = `Analyze this job posting and extract structured details.

Source URL: ${url}
Platform: ${platform}

Page Content:
${content.substring(0, 6e3)}

Return ONLY valid JSON.`;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2e3,
      response_format: { type: "json_object" }
    });
    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for job analysis");
    }
    const parsed = JSON.parse(result);
    return {
      title: parsed.title || "Unknown Position",
      company: parsed.company || "Unknown Company",
      location: parsed.location || "Not specified",
      salary: parsed.salary || void 0,
      jobType: parsed.jobType || "unknown",
      skills: parsed.skills || [],
      responsibilities: parsed.responsibilities || [],
      experienceRequired: parsed.experienceRequired || "Not specified",
      keywords: parsed.keywords || [],
      description: parsed.description || "",
      qualifications: parsed.qualifications || [],
      benefits: parsed.benefits || [],
      platform
    };
  }
}
