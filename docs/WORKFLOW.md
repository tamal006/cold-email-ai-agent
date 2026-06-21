# WORKFLOWS & SEQUENCE DIAGRAMS: ColdMail AI Agent

## 1. High-Level Core Workflow

Below is the visual lifecycle of a job application processed through the system:

```mermaid
graph TD
    Start([User Submits Job URL]) --> PlatformDetect[Detect Platform: LinkedIn/Naukri/etc.]
    PlatformDetect --> WebScrape[Scrape Web Page HTML/Text]
    WebScrape --> JobAnalyzeAgent[JobAnalysisAgent: Extract title, company, requirements]
    JobAnalyzeAgent --> DB_Job[(Save Job in DB)]
    
    DB_Job --> CompanyResearchAgent[CompanyResearchAgent: Identify products, mission, stack]
    CompanyResearchAgent --> DB_Company[(Save Company Insight)]
    
    DB_Company --> ContactDiscover[ContactDiscoveryAgent: Find target recruiters/managers]
    ContactDiscover --> ContactRank[ContactRankingAgent: Score & sort by relevance]
    ContactRank --> DB_Contact[(Save Contacts in DB)]
    
    DB_Contact --> MatchResume[ResumeMatchingAgent: Compare resume skills vs job details]
    MatchResume --> GenerateOutreach[OutreachAgent: Draft cold email, LinkedIn connect, referral request]
    
    GenerateOutreach --> GradeLoop[EmailValidatorTool: Grade copy & suggest changes]
    GradeLoop -->|Score < Threshold & Attempt < 3| GradeLoop
    GradeLoop -->|Score passes or Attempt = 3| DB_Email[(Save Email Draft in DB)]
    
    DB_Email --> UserReview[User Reviews Draft in UI]
    UserReview -->|Update Subject/Content| DB_Email
    UserReview -->|Click Send| EmailSenderTool[EmailSenderTool: Send via SMTP]
    
    EmailSenderTool -->|Success| DB_Sent[(Update Email: Sent, Update Tracker: Outreach Sent)]
    EmailSenderTool -->|Failure| DB_Fail[(Update Email: Failed)]
```

---

## 2. Step-by-Step Sequence Diagrams

### A. Job Analysis Flow
This flow details how a user's job URL submission is scraped, parsed, structured, and saved in MongoDB.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as jobController
    participant A as JobAnalysisAgent
    participant T as WebScraperTool
    participant LLM as Groq / Llama 3.3
    participant DB as MongoDB (Job Collection)

    User->>C: POST /api/jobs/analyze { url }
    C->>C: Validate URL & check existing Job
    C->>A: analyze(url)
    A->>A: detectPlatform(url)
    A->>T: scrape(url)
    T-->>A: Raw text content
    A->>LLM: extractJobDetails(content)
    LLM-->>A: Structured JSON job data
    A-->>C: Complete analysis object
    C->>DB: Job.create(analysis)
    DB-->>C: Saved Job Document
    C-->>User: HTTP 201 { job }
```

### B. Contact Discovery & Ranking Flow
This flow is triggered after a job is analyzed. It researches the company, generates relevant contact templates, and ranks them by match score.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as contactController
    participant R as CompanyResearchAgent
    participant D as ContactDiscoveryAgent
    participant RK as ContactRankingAgent
    participant DB as MongoDB

    User->>C: POST /api/contacts/discover/:jobId
    C->>DB: Check if Company exists
    alt Company not researched
        C->>R: research(companyName, jobTitle)
        R-->>C: Website, products, mission
        C->>DB: Company.create()
    end
    C->>DB: Check if Contacts exist
    alt Contacts empty
        C->>D: discover(companyName, jobTitle, website)
        D-->>C: Contact placeholders
        C->>RK: rank(contacts, jobTitle, jobSkills)
        RK-->>C: Contacts scored & ranked
        C->>DB: Save Contacts & Update Job status
    end
    C-->>User: HTTP 200 { company, contacts }
```

### C. Email Generation & Validation Flow
Coordinates the email generation process. It uses a recursive loop to ensure quality copy before saving the draft.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as agentController
    participant A as ColdEmailAgent
    participant G as EmailGeneratorTool
    participant V as EmailValidatorTool
    participant O as SubjectOptimizerTool
    participant DB as MongoDB

    User->>C: POST /api/agent/generate { recipient, purpose, tone }
    C->>A: run(input)
    loop Up to 3 attempts
        A->>G: generate(input)
        G-->>A: { subject, content, htmlContent }
        A->>V: validate(subject, content)
        V-->>A: { score, grammar, readability, passesQuality, suggestions }
        alt passesQuality = true or attempt = 3
            Note over A: Exit Loop
        end
    end
    A->>O: optimize(subject, content)
    O-->>A: 5 Alternative subjects
    A-->>C: Best email draft + alternatives
    C->>DB: Save draft in Email Collection
    DB-->>C: Saved draft document
    C-->>User: HTTP 200 { email, qualityScore, alternatives }
```

### D. Email Sending Flow
Dispatches the email via SMTP and transitions the application tracker status.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as outreachController
    participant DB as MongoDB
    participant S as EmailSenderTool
    participant SMTP as SMTP (Nodemailer)

    User->>C: POST /api/outreach/send { emailId }
    C->>DB: Find Email & User settings
    DB-->>C: Email data
    C->>S: send({ to, subject, body, html })
    S->>SMTP: SMTP transport send
    SMTP-->>S: messageId (success/failure)
    alt SMTP Success
        S-->>C: { success: true }
        C->>DB: Update Email (status: "sent", sentAt)
        C->>DB: Update JobTracker status to "outreach_sent"
        C-->>User: HTTP 200 { message: "Email sent" }
    else SMTP Failure
        S-->>C: { success: false, error }
        C->>DB: Update Email (status: "failed")
        C-->>User: HTTP 500 { error }
    end
```

### E. Authentication Flow
Details how standard JWT security is validated across API calls and client routing.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant FE as React Frontend
    participant BE as Express Backend
    participant JWT as Auth Middleware
    participant DB as MongoDB (User Collection)

    User->>FE: Inputs email & password
    FE->>BE: POST /api/auth/login { email, password }
    BE->>DB: User.findOne({ email }).select('+password')
    DB-->>BE: User record
    BE->>BE: Bcrypt compare password
    BE->>BE: Sign JWT Token
    BE-->>FE: HTTP 200 { token, user }
    FE->>FE: Store Token in LocalStorage
    Note over FE: Navigate to Dashboard (Protected Route)
    FE->>BE: GET /api/auth/profile (Headers: Authorization Bearer token)
    BE->>JWT: Verify Token signature & expiry
    JWT->>DB: User.findById(decoded.id)
    DB-->>JWT: User details
    JWT-->>BE: Next()
    BE-->>FE: HTTP 200 { user }
```

### F. Resume Matching Flow
Parses the user's resume text, extracts skills, matches it against requirements, and scores it.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as profileController
    participant DB as MongoDB
    participant A as ResumeMatchingAgent
    participant LLM as Groq / Llama 3.3

    User->>C: POST /api/profile/match-resume { jobId }
    C->>DB: Find User Profile & Job Details
    DB-->>C: Profile resumeText & Job skills
    C->>A: match({ resumeText, userSkills, jobSkills })
    A->>LLM: Compare resume profile against job description
    LLM-->>A: JSON { matchScore, missingSkills, improvements, projects, keywords }
    A-->>C: Score & recommendation analysis
    C-->>User: HTTP 200 { match }
```
