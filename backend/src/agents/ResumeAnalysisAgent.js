import OpenAI from "openai";
import { env } from "../config/env.js";

const openai = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export class ResumeAnalysisAgent {
  /**
   * Parse resume file buffer into text based on file type.
   * Supports PDF, DOCX, and TXT formats.
   */
  async extractText(fileBuffer, fileType) {
    console.log(`📄 ResumeAnalysisAgent: Extracting text from ${fileType} file...`);

    let text = "";

    switch (fileType) {
      case "pdf": {
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: fileBuffer });
        const data = await parser.getText();
        text = data.text;
        await parser.destroy();
        break;
      }
      case "docx": {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        text = result.value;
        break;
      }
      case "txt": {
        text = fileBuffer.toString("utf-8");
        break;
      }
      default:
        throw new Error(`Unsupported file type: ${fileType}. Use PDF, DOCX, or TXT.`);
    }

    if (!text || text.trim().length < 50) {
      throw new Error("Could not extract sufficient text from the resume. Please upload a readable file.");
    }

    console.log(`  ✅ Extracted ${text.length} characters from resume`);
    return text.trim();
  }

  /**
   * Analyze extracted resume text using AI to produce a structured profile.
   */
  async analyze(resumeText) {
    console.log("🧠 ResumeAnalysisAgent: Analyzing resume with AI...");

    const systemPrompt = `You are a professional resume parser and career analyst. Extract structured information from the provided resume text.

Return ONLY valid JSON with exactly these fields:
- "name": string - Full name of the candidate
- "email": string or null - Email address if found
- "phone": string or null - Phone number if found
- "education": array of objects with { "degree": string, "institution": string, "year": string, "gpa": string or null }
- "skills": string[] - All technical and soft skills mentioned (separate individual technologies)
- "projects": array of objects with { "name": string, "description": string, "techStack": string[], "url": string or null }
- "experience": array of objects with { "role": string, "company": string, "duration": string, "description": string }
- "certifications": string[] - Professional certifications
- "achievements": string[] - Awards, honors, notable achievements
- "hackathons": string[] - Hackathon participations and wins
- "github": string or null - GitHub profile URL
- "linkedin": string or null - LinkedIn profile URL
- "portfolio": string or null - Portfolio website URL
- "summary": string - A 2-3 sentence professional summary of the candidate

Guidelines:
- Extract EVERY piece of information available, even if sparse
- For skills, list individual technologies separately (e.g., ["React", "Node.js"] not ["React/Node.js"])
- Include ALL projects mentioned, even academic or personal ones
- Capture hackathon wins, competition placements, and awards in achievements
- If information is not available, use null for strings and empty arrays for lists
- Generate the summary based on the overall profile`;

    const userPrompt = `Parse this resume and extract structured information:

${resumeText.substring(0, 8000)}

Return ONLY valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI for resume analysis");
    }

    const parsed = JSON.parse(result);

    const profile = {
      name: parsed.name || "Unknown",
      email: parsed.email || null,
      phone: parsed.phone || null,
      education: parsed.education || [],
      skills: parsed.skills || [],
      projects: parsed.projects || [],
      experience: parsed.experience || [],
      certifications: parsed.certifications || [],
      achievements: parsed.achievements || [],
      hackathons: parsed.hackathons || [],
      github: parsed.github || null,
      linkedin: parsed.linkedin || null,
      portfolio: parsed.portfolio || null,
      summary: parsed.summary || "",
    };

    console.log(`  ✅ Resume parsed: ${profile.name}`);
    console.log(`     Skills: ${profile.skills.length} | Projects: ${profile.projects.length} | Experience: ${profile.experience.length}`);

    return profile;
  }

  /**
   * Full pipeline: extract text from file buffer, then analyze.
   */
  async run(fileBuffer, fileType) {
    const rawText = await this.extractText(fileBuffer, fileType);
    const profile = await this.analyze(rawText);
    return { rawText, profile };
  }
}
