# File Structure & Codebase Documentation: MailCraft AI

This document maps out the directories, modules, and roles of the source files in the MailCraft AI repository.

---

## 1. Directory Tree Layout

```
aiagent/
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Draft.js
│   │   │   ├── Email.js
│   │   │   ├── Job.js
│   │   │   ├── Resume.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── draftRoutes.js
│   │   │   ├── emailRoutes.js
│   │   │   ├── generateRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   └── resumeRoutes.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── draftController.js
│   │   │   ├── emailController.js
│   │   │   ├── generateController.js
│   │   │   ├── jobController.js
│   │   │   ├── profileController.js
│   │   │   └── resumeController.js
│   │   ├── agents/
│   │   │   ├── CandidateMatchingAgent.js
│   │   │   ├── EmailEditingAgent.js
│   │   │   ├── EmailGenerationAgent.js
│   │   │   ├── EmailScoringAgent.js
│   │   │   ├── JobAnalysisAgent.js
│   │   │   ├── ResumeAnalysisAgent.js
│   │   │   └── ToneTransformationAgent.js
│   │   ├── tools/
│   │   │   ├── EmailSenderTool.js
│   │   │   └── WebScraperTool.js
│   │   └── utils/
│   │       └── validators.js
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── inject-react.js
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── ui/
        │   ├── dashboard/
        │   ├── generate/
        │   │   ├── AIChatEditor.jsx
        │   │   ├── ExportButtons.jsx
        │   │   ├── GenerationStepper.jsx
        │   │   ├── JobDetailsCard.jsx
        │   │   ├── MatchAnalysisCard.jsx
        │   │   ├── QualityScore.jsx
        │   │   ├── ResumeInsightsCard.jsx
        │   │   ├── SubjectSelector.jsx
        │   │   └── ToneSelector.jsx
        │   ├── layout/
        │   └── resume/
        │       ├── ParsedResumeView.jsx
        │       ├── ResumeCard.jsx
        │       └── ResumeUploader.jsx
        ├── hooks/
        │   └── useAuth.jsx
        ├── lib/
        │   └── utils.js
        ├── services/
        │   ├── api.js
        │   ├── authService.js
        │   ├── dashboardService.js
        │   ├── draftService.js
        │   ├── emailService.js
        │   ├── generateService.js
        │   ├── jobService.js
        │   └── resumeService.js
        └── pages/
            ├── DashboardPage.jsx
            ├── EmailDetailPage.jsx
            ├── EmailHistoryPage.jsx
            ├── GenerateEmailPage.jsx
            ├── JobAnalyzerPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── ResumeUploadPage.jsx
            ├── SavedDraftsPage.jsx
            └── SettingsPage.jsx
```

---

## 2. Directory Responsibilities

| Directory | Primary Responsibility | Key Dependencies |
| :--- | :--- | :--- |
| **`backend/src/config/`** | Loads environment variables and connects database | `dotenv`, `mongoose` |
| **`backend/src/models/`** | Defines schema structures and data validations | `mongoose`, `bcryptjs` |
| **`backend/src/middleware/`** | Handles Bearer token check and user auth | `jsonwebtoken` |
| **`backend/src/routes/`** | Connects endpoints to validator rules and controllers | `express`, `express-validator` |
| **`backend/src/controllers/`** | Executes DB operations and triggers AI pipelines | Models, AI Agents |
| **`backend/src/agents/`** | Executes LLM generations and reviews | `openai` client, Groq API |
| **`backend/src/tools/`** | Integrates external calls like SMTP or Cheerio scrapers | `cheerio`, `nodemailer`, `axios` |
| **`frontend/src/components/`** | Builds modular UI blocks (cards, editors, uploaders) | React, Tailwind, Lucide Icons |
| **`frontend/src/services/`** | Dispatches HTTP requests to the backend server | Axios client |
| **`frontend/src/pages/`** | Combines components into full route containers | React, React Router |

---

## 3. Backend Source File Index

### Models (`backend/src/models/*`)
- **`User.js`**: User profile parameters (name, email, password, headline, skills, projects, achievements).
- **`Resume.js`**: Uploaded resume metadata, raw extracted string text, and parsed profile blocks.
- **`Job.js`**: Scraped and structured details of job postings (skills, location, qualifications, description).
- **`Draft.js`**: Saved application drafts containing edit chat logs, match scores, and custom tone options.
- **`Email.js`**: Output cold emails with 6-dimension quality reviews, alternative subject lines, and version logs.

### Controllers (`backend/src/controllers/*`)
- **`authController.js`**: Registers users, handles logins, and fetches profile credentials.
- **`resumeController.js`**: Manages resume uploads, triggers PDF/DOCX parsing, lists and deletes resumes.
- **`generateController.js`**: Executes the email generation pipeline, live edits via chat, and transforms tones.
- **`jobController.js`**: Connects to scrapers, lists job records, and fetches job descriptions.
- **`draftController.js`**: Manages creation, listing, details, and deletions of draft records.
- **`dashboardController.js`**: Aggregates statistical metrics for the dashboard view.
- **`emailController.js`**: Fetches generated history list, individual emails, and dispatches via SMTP.
- **`profileController.js`**: Handles user profile sync.

### Agents (`backend/src/agents/*`)
- **`ResumeAnalysisAgent.js`**: Parses PDF, DOCX, and TXT files and converts them into structured profiles.
- **`JobAnalysisAgent.js`**: Extracts structured parameters from raw job posting pages.
- **`CandidateMatchingAgent.js`**: Compares candidate profile data against job specs to extract matching scores and gaps.
- **`EmailGenerationAgent.js`**: Crafts personalized job emails and evaluates quality thresholds before saving.
- **`EmailEditingAgent.js`**: Modifies copy based on conversation instructions.
- **`ToneTransformationAgent.js`**: Changes email writing styles across 9 presets on-demand.
- **`EmailScoringAgent.js`**: Computes grades for CTA, spam risk, personalization, readability, grammar, and professionalism.

---

## 4. Frontend Source File Index

- **`frontend/src/inject-react.js`**: Injects React globally onto `window` to support legacy `React.createElement` transpilation.
- **`frontend/src/main.jsx`**: Global entry point mapping.
- **`frontend/src/App.jsx`**: Handles routing paths (protected routes, layouts, parameters).
- **`frontend/src/components/ProtectedRoute.jsx`**: Validates credentials before loading layout components.
- **`frontend/src/hooks/useAuth.jsx`**: Manages JWT registration, login, and localStorage cache.
- **`frontend/src/components/generate/*`**: Houses components for the generation screen (steppers, preview edit boxes, tone selector tabs, quality score gauges, subject line selectors, AI chat editor, resume details cards).
- **`frontend/src/components/resume/*`**: Implements drag-and-drop file upload progress, resume listing elements, and detailed profile drawers.
