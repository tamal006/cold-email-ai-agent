# AI AGENTS & TOOLS DOCUMENTATION: ColdMail AI Agent

This document explains the architecture, prompting, and operational details of the AI Agents and Tools deployed across the platform. All agent prompts are optimized for the **`llama-3.3-70b-versatile`** model hosted via Groq.

---

## 1. Summary of AI Agents

| Agent / Tool Class | Core Responsibility | Output Format | Temperature |
| :--- | :--- | :--- | :--- |
| **`JobAnalysisAgent`** | Scrapes & structures job postings | JSON Object | `0.3` |
| **`CompanyResearchAgent`** | Aggregates company background details | JSON Object | `0.4` |
| **`ContactDiscoveryAgent`** | Suggests stakeholder outreach personas | JSON Array | `0.5` |
| **`ContactRankingAgent`** | Prioritizes target contacts | JSON Array | `0.3` |
| **`OutreachAgent`** | Drafts customized multi-channel templates | JSON Object | `0.7` |
| **`EmailValidatorTool`** | Audits copy across multiple metrics | JSON Object | `0.2` |
| **`ResumeMatchingAgent`** | Assesses ATS skill alignment & gaps | JSON Object | `0.3` |

---

## 2. Deep Dive: Agent Specifications

### A. JobAnalysisAgent
- **Responsibilities**:
  1. Detects platform origin from URL string patterns.
  2. Scrapes job page content via the `WebScraperTool`.
  3. Prompts the LLM to structure and extract role requirements.
- **Inputs**: `url` (string).
- **Outputs**:
  - `title`, `company`, `location`, `salary`, `jobType` ("remote" | "hybrid" | "onsite" | "unknown")
  - `skills` (string[]), `responsibilities` (string[]), `experienceRequired` (string)
  - `keywords` (string[]), `description` (string), `qualifications` (string[])
- **Prompt Strategy**: Instructs the model to avoid compound tags (e.g. extracts `["React", "TypeScript"]` instead of `["React/TypeScript"]`) and dynamically resolve company names from URL slugs if page body text is obfuscated.
- **Error Handling**: Falls back to parsing information purely from the URL path if scraping is blocked by robots/WAF restrictions.

### B. CompanyResearchAgent
- **Responsibilities**: Generates factual intelligence about target companies to customize candidate outreach copy.
- **Inputs**: `companyName` (string), `jobTitle` (string).
- **Outputs**:
  - `name`, `website`, `industry`, `companySize`, `mission`, `insightSummary` (3-4 sentences detailing unique focus areas)
  - `products` (string[]), `services` (string[]), `techStack` (string[]), `recentNews` (string[])
- **Prompt Strategy**: Instructs the model to limit responses strictly to high-confidence training knowledge and return `null` for unknown fields rather than fabricating news or stack details.
- **Error Handling**: Catches parsing failures and returns a default schema populated with the query name and empty array arrays.

### C. ContactDiscoveryAgent
- **Responsibilities**: Proposes stakeholder personas (recruiters, engineering managers) for outreach.
- **Inputs**: `companyName` (string), `jobTitle` (string), `companyWebsite` (string).
- **Outputs**:
  - `contacts`: Array of objects containing `fullName`, `role`, `department`, `profileUrl`, `email`, `emailStatus` ("available" | "not_publicly_available"), `confidenceScore`, and `isSuggested` (boolean).
- **Prompt Strategy**: Enforces a strict rule against fabricating personal details. The agent defaults to suggested contact types (e.g. `isSuggested: true`, `fullName: "Hiring Manager at [Company]"`) unless public records permit high-confidence specific names.
- **Error Handling**: Intercepts JSON structure anomalies, ensuring the returned array is validated and bounded between 5 to 8 contacts.

### D. ContactRankingAgent
- **Responsibilities**: Ranks contact lists by hiring impact and relevance to the candidate.
- **Inputs**: `contacts` (array), `jobTitle` (string), `skills` (string[]), `companyName` (string).
- **Outputs**: Array of contacts ordered by `relevanceScore` (0-100), with a `rankReason` string appended to each contact.
- **Prompt Strategy**: Directs the LLM to score contacts using a weighted calculation:
  - **40%**: Direct hiring involvement.
  - **25%**: Department alignment.
  - **20%**: Reachable seniority.
  - **15%**: Specific keyword overlap.
- **Error Handling**: Compares output array indices against input parameters and pushes any unranked contacts to the end of the list with a default score of 30.

### E. OutreachAgent
- **Responsibilities**: Drafts multi-channel outreach copy (cold email, LinkedIn connection, referral request, short networking note).
- **Inputs**: Combine user profile details (headline, skills, achievements) and analyzed job specs.
- **Outputs**: JSON object containing `subjectLine`, `coldEmail` (plain text), `coldEmailHtml`, `linkedinMessage` (max 300 characters), `linkedinFollowUp`, `referralRequestEmail`, `referralRequestEmailHtml`, and `shortNetworkingMessage`.
- **Prompt Strategy**: Feeds personalization components (openings, connections) into the final generation prompt to increase conversion rates.
- **Error Handling**: Uses fallback templates if the LLM output is corrupt or fails to parse.

### F. EmailValidatorTool (EmailValidationAgent)
- **Responsibilities**: Audits generated subject lines and bodies.
- **Inputs**: `subject` (string), `content` (string).
- **Outputs**: JSON containing `score` (0-100), `grammar` (0-100), `readability` (0-100), `professionalism` (0-100), `spamScore` (0-100), `lengthScore` (0-100), `passesQuality` (boolean), and `suggestions` (string[]).
- **Prompt Strategy**: Analyzes text for common spam trigger words and penalizes readability scores if sentences exceed 25 words or contain excessive exclamation marks.
- **Error Handling**: Defaults to a fallback pass status if validation fails to prevent blocking user workflows.

### G. ResumeMatchingAgent
- **Responsibilities**: Runs ATS matching and extracts skill gaps.
- **Inputs**: User's `resumeText` + list of skills and target job details.
- **Outputs**: JSON object containing `matchScore` (0-100), `matchingSkills` (string[]), `missingSkills` (string[]), `recommendedImprovements` (string[]), `suggestedProjects` (string[]), `suggestedKeywords` (string[]), and `summary` (assessment review).
- **Prompt Strategy**: Evaluates the profile against standard ATS parser patterns, identifying key industry buzzwords and tools the candidate should list on their resume.
- **Error Handling**: Catches payload truncation errors and returns a moderate match assessment (score 50) on empty resume submissions.
