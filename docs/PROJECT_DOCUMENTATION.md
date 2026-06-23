# Project Documentation: MailCraft AI

## 1. Executive Summary
**MailCraft AI** is a full-stack, production-ready SaaS application designed to help job seekers stand out by generating highly personalized cold application emails. By matching an uploaded resume (PDF/DOCX/TXT) against target job posting URLs (LinkedIn, Naukri, Internshala, corporate career pages, etc.), the platform uses a multi-agent AI system to parse resume history, analyze job details, calculate ATS-style matching scores, identify skill gaps, and craft customized email applications. Users can further tweak the output through an AI Chat Editor, apply writing tone presets, check quality metrics, and copy or export their final application.

A candidate's journey using the application is shown below:

```mermaid
graph LR
    A[Upload Resume] --> B[Submit Job URL]
    B --> C[Analyze & Compare]
    C --> D[Generate Personal Email]
    D --> E[Tweak via Chat & Tones]
    E --> F[Copy / Export / Save]
```

---

## 2. Project Vision
Our vision is to empower job seekers by automating the tedious parts of custom applications. Generic application submissions lead to low response rates, but custom networking outreach gets candidates noticed. MailCraft AI acts as an automated career coach and copywriter, enabling candidates to highlight their matching skills, projects, and achievements to specific hiring managers in seconds.

---

## 3. Problem Statement & Business Value

### The Problem
- **Application Fatigue**: Candidates send generic resumes to hundreds of ATS boards, resulting in very low callback rates.
- **Outreach Friction**: Crafting customized, high-quality, and professional cold emails for each job posting is time-consuming and requires strong writing skills.
- **Factual Hallucinations**: Standard LLMs often invent achievements or skills when generating application drafts. MailCraft AI resolves this by referencing strictly verified facts extracted directly from the candidate's resume.
- **Workflow Disconnect**: Job seekers jump between multiple resume builders, job sites, and draft editors, resulting in a disjointed process.

### Target Users
- **Active Job Seekers**: Professionals seeking their next career opportunity.
- **Students & Graduates**: Candidates seeking internships or entry-level positions.
- **Freelancers & Consultants**: Contractors pitching their services to project decision-makers.

### Business Value
- **Uncompromised Accuracy**: Enforces factual constraints (only references skills, projects, achievements, and education that exist on the user's resume).
- **Substantive Quality Checks**: Runs multi-dimension scoring (spam probability, readability, CTA strength, professionalism) before presenting drafts.
- **Live Interactive Editors**: Merges automated pipelines with human control through chat commands and one-click style tone presets.

---

## 4. System Goals
1. **Accurate Document Parsing**: Extract clean text from PDF, DOCX, and TXT resumes.
2. **Platform Scraper Agnosticism**: Extract job posting details from LinkedIn, Naukri, Internshala, and custom corporate pages.
3. **Structured ATS-Style Matching**: Analyze skill gaps and candidate strengths.
4. **Recursive Quality Loop**: Score emails and automatically retry generation if the draft score is below threshold.
5. **Interactive UI**: Render modern SaaS dashboards and split editors with loading states.

---

## 5. Technology Stack Summary

| Technology | Layer | Role / Purpose |
| :--- | :--- | :--- |
| **React 18** | Frontend | Core component architecture and UI rendering |
| **Vite** | Frontend Tooling | Fast bundler and local development server |
| **Tailwind CSS** | Styling | Sleek dark-mode theme and responsive layouts |
| **Node.js / Express** | Backend | RESTful API server using native ES Modules |
| **MongoDB / Mongoose** | Database | Stores user accounts, job postings, resumes, drafts, and email logs |
| **OpenAI / Groq API** | AI / LLM | Llama 3.3 70B model for parsing, matching, drafting, and editing |
| **PDFParse & Mammoth** | File Parsing | Parses uploaded PDF and DOCX files on the backend |
| **Bcrypt.js** | Security | Hashes user passwords with 12 rounds |
| **JWT** | Auth | Secures API endpoints via JWT tokens passed in Headers |
