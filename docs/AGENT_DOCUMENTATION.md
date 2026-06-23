# AI Agents & Pipelines Documentation: MailCraft AI

This document details the architecture, prompting, and operational strategies of the AI Agents and pipelines deployed across the MailCraft AI platform. All agents are optimized for the **`llama-3.3-70b-versatile`** model hosted via Groq.

---

## 1. Summary of AI Agents

| Agent Class | Core Responsibility | Output Format | Temperature |
| :--- | :--- | :--- | :--- |
| **`JobAnalysisAgent`** | Scrapes & structures job listings from URLs | JSON Object | `0.3` |
| **`ResumeAnalysisAgent`** | Parses raw resume text into structured profile | JSON Object | `0.2` |
| **`CandidateMatchingAgent`** | Analyzes match alignment and gaps | JSON Object | `0.3` |
| **`EmailGenerationAgent`** | Crafts personalized cold outreach applications | JSON Object | `0.7` |
| **`EmailEditingAgent`** | Edits generated emails via chat conversation | JSON Object | `0.6` |
| **`ToneTransformationAgent`** | Rewrites emails using 9 different writing styles | JSON Object | `0.5` |
| **`EmailScoringAgent`** | Rates email quality across 6 score metrics | JSON Object | `0.2` |

---

## 2. Agent Deep Dive

### A. JobAnalysisAgent
- **Responsibilities**:
  1. Detects platform origin from URL string patterns (LinkedIn, Naukri, Internshala, etc.).
  2. Scrapes job page contents.
  3. Formulates a structured JSON description of the job requirements.
- **Inputs**: `url` (string).
- **Outputs**:
  - `title`, `company`, `location`, `salary`, `jobType` ("remote" | "hybrid" | "onsite" | "unknown")
  - `skills` (string[]), `responsibilities` (string[]), `experienceRequired` (string)
  - `keywords` (string[]), `description` (string), `qualifications` (string[])
  - `preferredQualifications` (string[]), `benefits` (string[]), `applicationDeadline` (string)

### B. ResumeAnalysisAgent
- **Responsibilities**:
  1. Extracts raw text from uploaded files (PDF, DOCX, TXT) via `PDFParse` and `mammoth`.
  2. Builds a comprehensive structured candidate profile.
- **Inputs**: `fileBuffer` (Buffer), `fileType` (string).
- **Outputs**:
  - `name` (string), `email` (string), `phone` (string)
  - `education` (array: `{ degree, institution, year, gpa }`)
  - `skills` (string[]), `projects` (array: `{ name, description, techStack, url }`)
  - `experience` (array: `{ role, company, duration, description }`)
  - `certifications` (string[]), `achievements` (string[]), `hackathons` (string[])
  - `github` (string), `linkedin` (string), `portfolio` (string)
  - `summary` (string - 2-3 sentence overview)

### C. CandidateMatchingAgent
- **Responsibilities**:
  1. Performs a detailed ATS-style comparison of the candidate's parsed profile against the job posting.
  2. Computes alignment score and gathers detailed strengths/weaknesses.
- **Inputs**: `jobAnalysis` (object), `resumeProfile` (object).
- **Outputs**:
  - `matchScore` (number 0-100)
  - `matchingSkills` (string[]), `missingSkills` (string[])
  - `strengths` (string[]), `weaknesses` (string[])
  - `relevantProjects` (string[]), `relevantExperience` (string[])
  - `recommendation` (string - 2-3 sentence application advice)

### D. EmailGenerationAgent
- **Responsibilities**:
  1. Drafts highly personalized cold application emails matching skills and projects without fabricating facts.
  2. Evaluates the text against quality metrics and automatically retries generation if quality is below threshold.
  3. Generates 5 alternative subject line options.
- **Inputs**: `jobAnalysis` (object), `resumeProfile` (object), `matchAnalysis` (object), `userSummary` (string), `userInstructions` (string).
- **Outputs**:
  - `subject` (string), `content` (string), `htmlContent` (string)
  - `subjectOptions` (string[]), `qualityScores` (object)

### E. EmailEditingAgent
- **Responsibilities**:
  1. Updates the subject and body of an email based on a chat instruction.
  2. Sustains multi-turn conversation context using chat message history.
- **Inputs**: `currentEmail` (string), `currentSubject` (string), `instruction` (string), `chatHistory` (array), `context` (object).
- **Outputs**:
  - `subject` (string), `content` (string), `htmlContent` (string)
  - `changeDescription` (string)

### F. ToneTransformationAgent
- **Responsibilities**:
  1. Converts writing style on-click into 9 presets (`professional`, `friendly`, `formal`, `confident`, `enthusiastic`, `corporate`, `startup`, `minimal`, `recruiter-friendly`).
  2. Preserves facts, achievements, and core message structure.
- **Inputs**: `currentContent` (string), `currentSubject` (string), `tone` (string).
- **Outputs**:
  - `subject` (string), `content` (string), `htmlContent` (string)

### G. EmailScoringAgent
- **Responsibilities**: Evaluates generated email text on quality benchmarks.
- **Inputs**: `subject` (string), `content` (string).
- **Outputs**:
  - `professionalismScore`, `personalizationScore`, `grammarScore`, `readabilityScore`, `recruiterAppealScore`, `ctaScore`, `overallScore` (all 0-100)
  - `suggestions` (string[])
