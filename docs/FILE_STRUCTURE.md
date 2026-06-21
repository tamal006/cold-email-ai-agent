# FILE STRUCTURE & CODEBASE DOCUMENTATION: ColdMail AI Agent

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
│   │   │   ├── Company.js
│   │   │   ├── Contact.js
│   │   │   ├── Email.js
│   │   │   ├── Job.js
│   │   │   ├── JobTracker.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── agentRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── contactRoutes.js
│   │   │   ├── emailRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   ├── outreachRoutes.js
│   │   │   └── trackerRoutes.js
│   │   ├── controllers/
│   │   │   ├── agentController.js
│   │   │   ├── authController.js
│   │   │   ├── contactController.js
│   │   │   ├── emailController.js
│   │   │   ├── jobController.js
│   │   │   ├── outreachController.js
│   │   │   ├── profileController.js
│   │   │   └── trackerController.js
│   │   ├── agents/
│   │   │   ├── ColdEmailAgent.js
│   │   │   ├── CompanyResearchAgent.js
│   │   │   ├── ContactDiscoveryAgent.js
│   │   │   ├── ContactRankingAgent.js
│   │   │   ├── JobAnalysisAgent.js
│   │   │   ├── OutreachAgent.js
│   │   │   ├── PersonalizationEngine.js
│   │   │   └── ResumeMatchingAgent.js
│   │   ├── tools/
│   │   │   ├── EmailGeneratorTool.js
│   │   │   ├── EmailHistoryTool.js
│   │   │   ├── EmailSenderTool.js
│   │   │   ├── EmailValidatorTool.js
│   │   │   ├── OutreachScorerTool.js
│   │   │   ├── SubjectOptimizerTool.js
│   │   │   └── WebScraperTool.js
│   │   └── utils/
│   │       ├── templates.js
│   │       └── validators.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ui/
│   │   │   ├── analytics/
│   │   │   ├── contacts/
│   │   │   ├── dashboard/
│   │   │   ├── email/
│   │   │   ├── job/
│   │   │   ├── layout/
│   │   │   ├── outreach/
│   │   │   └── tracker/
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx
│   │   │   └── useEmails.js
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── services/
│   │   │   ├── agentService.js
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── contactService.js
│   │   │   ├── emailService.js
│   │   │   ├── jobService.js
│   │   │   ├── outreachService.js
│   │   │   └── trackerService.js
│   │   └── pages/
```

---

## 2. Directory Responsibilities

| Directory | Primary Responsibility | Key Dependencies |
| :--- | :--- | :--- |
| **`backend/src/config/`** | Loads environment configurations and connects databases | `dotenv`, `mongoose` |
| **`backend/src/models/`** | Defines schema structures and data validations | `mongoose`, `bcryptjs` |
| **`backend/src/middleware/`** | Handles endpoint securities and authorization validation | `jsonwebtoken` |
| **`backend/src/routes/`** | Maps endpoints to handlers and validators | `express`, `express-validator` |
| **`backend/src/controllers/`** | Directs request flows, queries DBs, and spawns agents | Mongoose Models, AI Agents |
| **`backend/src/agents/`** | Coordinates and prompts LLMs for custom copying and analysis | `openai` client, Groq API |
| **`backend/src/tools/`** | Performs discrete tasks: HTTP scraping, validation, email sending | `cheerio`, `nodemailer`, `axios` |
| **`frontend/src/components/`**| Houses reusable components and modular blocks | React, Tailwind, Lucide Icons |
| **`frontend/src/services/`** | Dispatches asynchronous HTTP calls to the backend | Axios Client, LocalStorage |
| **`frontend/src/pages/`** | Renders view containers and structures forms | React-Router, Page States |

---

## 3. Backend Source File Index

### `backend/src/index.js`
- **Purpose**: Main API server entry point.
- **Responsibilities**: Sets up Express middlewares, binds route clusters, exposes health check, and connects to MongoDB.
- **Dependencies**: `express`, `cors`, `helmet`, `express-rate-limit`, `mongoose`.

### `backend/src/config/db.js`
- **Purpose**: Connects to the Mongoose server.
- **Responsibilities**: Establishes a database connection pool with automatic retry fallback on database loading timeouts.
- **Dependencies**: `mongoose`, `env.js`.

### `backend/src/config/env.js`
- **Purpose**: Configuration boundary load mapping.
- **Responsibilities**: Asserts environment variables (throws on missing critical keys like JWT_SECRET or GROQ_API_KEY) and loads defaults.
- **Dependencies**: `dotenv`.

### `backend/src/middleware/auth.js`
- **Purpose**: Endpoint request JWT authorization blocker.
- **Responsibilities**: Reads headers for Bearer token, verifies token signatures, and sets user identification `req.user` parameter.
- **Dependencies**: `jsonwebtoken`, `env.js`.

### Models (`backend/src/models/*`)
- **`User.js`**: User credentials, headline profiles, achievements, experience strings, and project structures. Includes password-hashing hooks.
- **`Job.js`**: Store details of analysed jobs (skills, platform, location, salary, descriptions, and current status).
- **`Company.js`**: Intelligence repository containing researched tech stacks, missions, products, and insights.
- **`Contact.js`**: Reached recruiter placeholder metrics, emails, email availabilities, and relevance scores.
- **`Email.js`**: Persists plain text and HTML drafts, tones, recipient parameters, validation grading outputs, and sent statuses.
- **`JobTracker.js`**: Boards application states (applied, interviewed, offers, rejections) and holds transition histories.

### Controllers (`backend/src/controllers/*`)
- **`authController.js`**: Implements profile retrieval, registrations, and Bcrypt password verification logic.
- **`agentController.js`**: Handles single-email generations, draft savings, and subject optimization API endpoints.
- **`jobController.js`**: Binds job URL scraping, listing, single job views, and job deletion.
- **`contactController.js`**: Triggers full company research pipelines and contact discovery, persisting results.
- **`outreachController.js`**: Manages complex multipronged generation (cold emails, LinkedIn messages, and referral requests).
- **`emailController.js`**: Exposes statistics aggregates, templates retrieval, and email records operations.
- **`profileController.js`**: Updates user resume content and matches resume details to target jobs.
- **`trackerController.js`**: Modifies board lanes and pushes status histories.

### Agents (`backend/src/agents/*`)
- **`JobAnalysisAgent.js`**: Classifies URL platform origins, scrapes raw page HTML, and prompts LLMs to extract details.
- **`CompanyResearchAgent.js`**: Obtains comprehensive metadata (tech stack, culture, news, and mission) for a target company.
- **`ContactDiscoveryAgent.js`**: Suggests networking roles (e.g. Talent Acquisition lead) and locates public emails.
- **`ContactRankingAgent.js`**: Scores contacts 0-100 by department matches, role seniorities, and hiring involvements.
- **`OutreachAgent.js`**: Drafts personalized emails, connections, and follow-ups.
- **`ColdEmailAgent.js`**: Pipeline orchestrator, recursively coordinating generator and validation tools.
- **`PersonalizationEngine.js`**: Extracts opening lines, value propositions, and role connections.
- **`ResumeMatchingAgent.js`**: Performs ATS skill gap extraction, match scoring, and improvement advice.

### Tools (`backend/src/tools/*`)
- **`WebScraperTool.js`**: Fetches URLs using headers, strips HTML tags with Cheerio, and parses clean text.
- **`EmailGeneratorTool.js`**: Prompts model to generate subject lines and email contents using Llama 3.3.
- **`EmailValidatorTool.js`**: Evaluates readability levels, grammar counts, and spam risks.
- **`SubjectOptimizerTool.js`**: Designs 5 catchy alternatives to standard subject headers.
- **`EmailSenderTool.js`**: Delivers outgoing letters utilizing SMTP mail transporters.
- **`EmailHistoryTool.js`**: Creates and updates email documents.
- **`OutreachScorerTool.js`**: Evaluates drafted outreach packages.

### Utils (`backend/src/utils/*`)
- **`templates.js`**: Houses pre-built default email template layouts.
- **`validators.js`**: Groups Express Validator middlewares for input verification.

---

## 4. Frontend Source File Index

- **`frontend/src/main.jsx`**: Bootstraps the application, mounts standard React DOM, and loads stylesheets.
- **`frontend/src/App.jsx`**: Declares routes (public vs protected) and configures `<Toaster />` systems.
- **`frontend/src/components/ProtectedRoute.jsx`**: Validates JWT authentication states before serving page elements.
- **`frontend/src/hooks/useAuth.jsx`**: Shares active user login states, handling token retention and profile syncing.
- **`frontend/src/hooks/useEmails.js`**: Exposes handlers to load logs and trigger draft updates.
- **`frontend/src/lib/utils.js`**: Houses standard class merger utilities (`clsx` and `tailwind-merge`).
- **`frontend/src/services/api.js`**: Configures global Axios interceptors to inject JWT headers automatically.
- **`frontend/src/services/*Service.js`**: Wraps backend API endpoints into discrete, awaitable JavaScript functions.
- **`frontend/src/pages/*Page.jsx`**:
  - `LoginPage.jsx` / `RegisterPage.jsx`: Authentication input panels.
  - `DashboardPage.jsx` / `AnalyticsPage.jsx`: Visualizes metrics and funnel statistics.
  - `JobTrackerPage.jsx`: Renders the Kanban board for application tracking.
  - `JobAnalyzerPage.jsx`: Submission interface for job URL scraping.
  - `ContactDiscoveryPage.jsx`: Displays found contacts and details company stats.
  - `OutreachGeneratorPage.jsx`: Orchestrates multivariant email copywriting.
  - `SettingsPage.jsx`: Manages active user profiles and resume content.
