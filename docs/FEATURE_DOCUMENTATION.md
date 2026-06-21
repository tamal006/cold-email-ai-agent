# FEATURE BREAKDOWN & FEATURE RUNTIMES: ColdMail AI Agent

This document breaks down the user experience, backend controllers, data pathways, and endpoint sequences for each core feature of the ColdMail AI Agent application.

---

## 1. Feature: Job Analyzer

- **Purpose**: Parses external job postings to extract structured role constraints.
- **Job Analyzer Data Flow**:
  ```mermaid
  graph TD
      A[Job URL Submitted] --> B{Scrape Successful?}
      B -->|Yes| C[Extract details from HTML body text]
      B -->|No| D[Fall back to URL path token analysis]
      C --> E[Prompt Llama 3.3 for structured JSON extraction]
      D --> E
      E --> F[Save to Job Collection as 'analyzed']
  ```
- **User Flow**:
  1. User navigates to the Job Analyzer dashboard page.
  2. Submits a job listing URL (e.g. LinkedIn, Internshala, corporate careers page).
  3. Displays a progress loader.
  4. Renders the structured role details (title, company, skills, location, responsibilities).
- **Backend Flow**:
  - The controller receives the request, scrapes the URL content via `WebScraperTool`, prompts `JobAnalysisAgent` to parse details, and saves the job to the database.
- **Database Flow**:
  - Pushes a new document to the `Jobs` collection with status set to `"analyzed"`.
- **API Endpoints**: `POST /api/jobs/analyze`
- **Files Involved**:
  - **Frontend**: `frontend/src/pages/JobAnalyzerPage.jsx`, `frontend/src/services/jobService.js`, `frontend/src/components/job/AnalysisProgress.jsx`
  - **Backend**: `backend/src/controllers/jobController.js`, `backend/src/agents/JobAnalysisAgent.js`, `backend/src/tools/WebScraperTool.js`, `backend/src/models/Job.js`

---

## 2. Feature: Contact Discovery & Ranking

- **Purpose**: Researches the target company and discovers relevant internal hiring stakeholders.
- **Contact Discovery Pipeline**:
  ```mermaid
  graph TD
      A[Click Find Contacts] --> B{Company Researched?}
      B -->|No| C[Run CompanyResearchAgent]
      C --> D[Save Company Insights in DB]
      B -->|Yes| E[Query existing Company profile]
      D --> F[Run ContactDiscoveryAgent]
      E --> F
      F --> G[Run ContactRankingAgent]
      G --> H[Create Contacts in DB with relevance & confidence scores]
  ```
- **User Flow**:
  1. From an analyzed job view, the user clicks **"Find Contacts"**.
  2. The interface displays company intelligence (industry, website, stack, news).
  3. Displays a list of target stakeholder contacts ranked by relevance.
  4. User can bookmark/save specific contacts to reference later.
- **Backend Flow**:
  1. Check if company researched; if not, query and save company insights.
  2. Discover suggested persona placeholder contacts.
  3. Rank contacts by relevance weightings.
- **Database Flow**:
  - Pushes a new document to the `Companies` collection.
  - Inserts 5-8 contacts into the `Contacts` collection (linked to `jobId` and `companyId`).
- **API Endpoints**:
  - `POST /api/contacts/discover/:jobId` (Discover and research company/contacts)
  - `GET /api/contacts/job/:jobId` (Get already discovered contacts)
  - `POST /api/contacts/save/:id` (Toggle save status)
- **Files Involved**:
  - **Frontend**: `frontend/src/pages/ContactDiscoveryPage.jsx`, `frontend/src/components/contacts/ContactCard.jsx`, `frontend/src/services/contactService.js`
  - **Backend**: `backend/src/controllers/contactController.js`, `backend/src/agents/CompanyResearchAgent.js`, `backend/src/agents/ContactDiscoveryAgent.js`, `backend/src/agents/ContactRankingAgent.js`, `backend/src/models/Contact.js`

---

## 3. Feature: Outreach Generator

- **Purpose**: Generates high-conversion, personalized outreach copy (emails, LinkedIn notes, referral requests).
- **Outreach Loop Flow**:
  ```mermaid
  graph TD
      A[Trigger Generation] --> B[Spawns OutreachAgent]
      B --> C[Generate Email draft]
      C --> D[Grade email content via validator tool]
      D --> E{Score >= 80 or Attempt = 3?}
      E -->|No| F[Refine copy and increment attempt]
      F --> C
      E -->|Yes| G[Generate 5 alternative subjects]
      G --> H[Save Email draft in DB]
  ```
- **User Flow**:
  1. User selects a contact and clicks **"Generate Outreach"**.
  2. Chooses the outreach type (Job Application, Referral Request, Networking, Follow-Up).
  3. Views the generated drafts side-by-side with optimization scores and 5 alternative subject lines.
  4. Modifies the content and clicks **"Send Email"**.
- **Backend Flow**:
  1. Aggregates the candidate's profile, job details, and company insights.
  2. Spawns `OutreachAgent` to generate personalized copy.
  3. Runs the draft through `OutreachScorerTool` (readability, tone, spam).
  4. Saves the generated draft.
  5. Sending emails uses `EmailSenderTool` via SMTP transport.
- **Database Flow**:
  - Pushes a draft to the `Emails` collection.
  - Updates the draft status to `"sent"` or `"failed"` depending on the SMTP server response.
- **API Endpoints**:
  - `POST /api/outreach/generate` (Generate copy)
  - `POST /api/outreach/score` (Score custom text)
  - `POST /api/outreach/send` (SMTP dispatch)
- **Files Involved**:
  - **Frontend**: `frontend/src/pages/OutreachGeneratorPage.jsx`, `frontend/src/components/outreach/OutreachPreview.jsx`, `frontend/src/services/outreachService.js`
  - **Backend**: `backend/src/controllers/outreachController.js`, `backend/src/agents/OutreachAgent.js`, `backend/src/tools/OutreachScorerTool.js`, `backend/src/tools/EmailSenderTool.js`, `backend/src/models/Email.js`

---

## 4. Feature: Job Application Kanban Board (Tracker)

- **Purpose**: A Kanban-style interface to manage application states from start to finish.
- **Tracker Card State Transitions**:
  ```mermaid
  stateDiagram-v2
      [*] --> Saved : Job Analyzed
      Saved --> OutreachSent : Email Dispatched via SMTP
      OutreachSent --> Applied : Application Form Submitted
      Applied --> InterviewScheduled : Company Invites Candidate
      InterviewScheduled --> OfferReceived : Interview Successful
      InterviewScheduled --> Rejected : Company Declines Candidate
      Applied --> Rejected
      OutreachSent --> Rejected
  ```
- **User Flow**:
  1. When a job is analyzed, the system automatically creates a Kanban card in the **"Saved"** lane.
  2. When outreach is sent, the card automatically transitions to **"Outreach Sent"**.
  3. User can drag and drop cards to change status (Applied, Interview Scheduled, Rejected, Offer Received) and append notes.
- **Backend Flow**:
  - Update requests receive the new lane status, validate it, append an entry to the card's history array, and update the document.
- **Database Flow**:
  - Modifies the target document in the `JobTrackers` collection and updates `statusHistory`.
- **API Endpoints**:
  - `GET /api/tracker` (List cards)
  - `PUT /api/tracker/:id` (Update card lane status/add notes)
- **Files Involved**:
  - **Frontend**: `frontend/src/pages/JobTrackerPage.jsx`, `frontend/src/components/tracker/TrackerBoard.jsx`, `frontend/src/services/trackerService.js`
  - **Backend**: `backend/src/controllers/trackerController.js`, `backend/src/models/JobTracker.js`

---

## 5. Security & Error Recovery Strategies

### Error Handling Protocols
1. **Scraping Blocked**: If a job site blocks our scraper (WAF/Cloudflare), `WebScraperTool` catches the exception. `JobAnalysisAgent` falls back to parsing information from the URL path, allowing the process to continue.
2. **AI Failure**: If the Groq API fails (rate limits, timeouts), the backend retries the request up to 3 times with exponential backoff before returning a user-friendly error.
3. **SMTP Connection Dropped**: If email dispatch fails, Nodemailer flags the error. The email draft is set to `"failed"` in the database, allowing the user to troubleshoot credentials and try again.

### Security Implementation
- **Password Protection**: Passwords are hashed with Bcrypt (12 rounds) on creation and updates.
- **Endpoint Security**: JWT authorization checks signatures and expiration on all API calls, rejecting unauthorized users.
- **Input Sanitation**: Express Validator sanitizes all user inputs (emails, passwords, URLs) to protect against SQL/NoSQL injection and XSS.

---

## 6. Future Enhancements & Scalability

1. **LinkedIn Automation Integration**: Introduce automated messaging extensions to dispatch LinkedIn connection requests directly from the UI.
2. **Multi-Recipient Email Campaigns**: Support automated follow-up sequences (e.g. sending a follow-up email 5 days after the initial outreach if no response is received).
3. **Parsed Resume AI Extraction**: Implement parsing to automatically extract and populate skills, achievements, and experience from uploaded PDF/Word resumes.
4. **Agent Swarms**: Use separate, parallel LLM workers for real-time contact validation and verification.
