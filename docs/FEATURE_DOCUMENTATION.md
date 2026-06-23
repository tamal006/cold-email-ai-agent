# Feature Breakdown & Feature Runtimes: MailCraft AI

This document details the user flows, backend controller actions, data structures, and endpoint sequences for each core feature of the MailCraft AI platform.

---

## 1. Feature: Job Analyzer

- **Purpose**: Scraping and structuring job requirements from external postings.
- **Scraping Pipeline**:
  ```mermaid
  graph TD
      A[Job URL Submitted] --> B{Scrape Successful?}
      B -->|Yes| C[Extract text from HTML body]
      B -->|No| D[Analyze URL slug tokens]
      C --> E[Prompt JobAnalysisAgent to extract structured JSON]
      D --> E
      E --> F[Save to Job collection as 'analyzed']
  ```
- **User Flow**:
  1. User enters a job URL (LinkedIn, Naukri, Internshala, Career page) on the **Job Analyzer** page.
  2. Click **Analyze**.
  3. UI displays extraction loader.
  4. Renders details: job title, company, required skills, responsibilities, experience, qualifications.
- **Backend Flow**:
  - `jobController.js` triggers `WebScraperTool` to extract HTML, parses details via `JobAnalysisAgent`, and saves the structured output.
- **Database Operations**: Pushes a new document to the `Jobs` collection.
- **API Endpoints**: `POST /api/jobs/analyze`, `GET /api/jobs/list`, `GET /api/jobs/:id`

---

## 2. Feature: Resume Manager

- **Purpose**: Parses uploaded PDF, DOCX, or TXT documents and extracts candidate details.
- **Resume Flow**:
  ```mermaid
  graph TD
      A[Upload Resume File] --> B{File Extension?}
      B -->|pdf| C[Parse with PDFParse class]
      B -->|docx| D[Extract with mammoth]
      B -->|txt| E[Read buffer as UTF-8 string]
      C --> F[Prompt ResumeAnalysisAgent for JSON profile]
      D --> F
      E --> F
      F --> G[Save to Resume collection]
  ```
- **User Flow**:
  1. User visits **Resume Manager** page.
  2. Drags and drops a PDF/DOCX file into the upload zone.
  3. Parsing animation appears.
  4. Parsed details (name, email, skills, education, projects, achievements, etc.) appear in a structured list.
  5. User can select which resume is the "Default" application profile.
- **Backend Flow**:
  - `resumeController.js` handles multipart form upload via `multer`, invokes `ResumeAnalysisAgent` to parse raw file text, and saves to database.
- **Database Operations**: Creates a new document in the `Resumes` collection.
- **API Endpoints**: `POST /api/resume/upload`, `GET /api/resume/list`, `GET /api/resume/:id`, `DELETE /api/resume/:id`, `PATCH /api/resume/:id/default`

---

## 3. Feature: Candidate Matcher

- **Purpose**: Runs ATS-style comparison between user profile and job posting.
- **User Flow**:
  1. Triggered automatically as part of the email generation pipeline.
  2. Renders match score, list of matching skills, list of missing gaps, strengths, weaknesses, and a positioning advice paragraph.
- **Backend Flow**:
  - Spawns `CandidateMatchingAgent` passing the parsed job context and the structured resume profile.
- **Database Operations**: Snapshot saved directly in the generated `Email` document.
- **API Endpoints**: Run internally within `POST /api/generate/full-pipeline`.

---

## 4. Feature: AI Email Generator Pipeline

- **Purpose**: Generates high-quality, customized cold emails with automatic verification and subject options.
- **Pipeline Flow**:
  ```mermaid
  graph TD
      A[Start Pipeline] --> B[Job Analysis Agent]
      B --> C[Candidate Matching Agent]
      C --> D[Email Generation Agent]
      D --> E[Email Scoring Agent]
      E --> F{Score >= 70 or Attempt = 3?}
      F -->|No| G[Refine draft copy and increment attempt]
      G --> D
      F -->|Yes| H[Generate 5 alternative subjects]
      H --> I[Save Draft to Emails collection]
  ```
- **User Flow**:
  1. User selects a resume, inputs a job URL, and adds optional background summary/custom instructions.
  2. Clicks **Generate Email**.
  3. Displays a multi-step stepper loader (Scraping → Matching → Drafting → Scoring).
  4. Renders generated email preview, match statistics, alternative subjects, and quality scores.
- **Backend Flow**:
  - Runs all agents sequentially in a transaction-like wrapper. Checks quality score dimensions, retries if below threshold, and appends alternative subject options.
- **Database Operations**: Creates an `Emails` collection document with status set to `"draft"`.
- **API Endpoints**: `POST /api/generate/full-pipeline`, `POST /api/generate/score`

---

## 5. Feature: AI Chat Editor & Tone Converter

- **Purpose**: Enables users to tweak, rewrite, or style the generated email.
- **User Flow**:
  1. **AI Chat Editor**: User enters prompt (e.g. "make it shorter", "focus on React"). The draft content updates instantly in place.
  2. **Tone Presets**: User clicks a pill button (e.g., startup style, corporate, minimal). The email transforms its tone instantly.
  3. **Alternative Subjects**: Click any of the 5 alternative subject lines to set it as active.
  4. **Save Draft**: Saves work-in-progress copy to continue editing later.
- **Backend Flow**:
  - AI Chat Editor uses `EmailEditingAgent` maintaining message histories.
  - Tone Presets use `ToneTransformationAgent` to re-style content.
- **Database Operations**: Inserts a draft into the `Drafts` collection or updates version histories in the `Emails` collection.
- **API Endpoints**: 
  - `POST /api/generate/edit`
  - `POST /api/generate/tone`
  - `POST /api/generate/subjects`
  - `POST /api/generate/update-subject`
  - `POST /api/drafts` (create/update/delete drafts)
