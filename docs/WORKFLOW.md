# Workflows & Sequence Diagrams: MailCraft AI

This document provides visual workflows and API call sequences for the core operations of MailCraft AI.

---

## 1. High-Level Core Workflow

Below is the visual lifecycle of a job application processed through the system:

```mermaid
graph TD
    Start([User Uploads Resume]) --> ResumeParse[Parse PDF/DOCX text via PDFParse/mammoth]
    ResumeParse --> ResumeAnalyze[ResumeAnalysisAgent: Extract structured profile]
    ResumeAnalyze --> DB_Resume[(Save Resume in DB)]
    
    DB_Resume --> UserInput[User submits Job URL + Optional Instructions/Summary]
    UserInput --> WebScrape[Scrape Web Page HTML/Text]
    WebScrape --> JobAnalyzeAgent[JobAnalysisAgent: Extract details]
    JobAnalyzeAgent --> DB_Job[(Save Job in DB)]
    
    DB_Job --> MatchResume[CandidateMatchingAgent: Compare resume vs job details]
    MatchResume --> GenerateEmail[EmailGenerationAgent: Draft customized email]
    
    GenerateEmail --> GradeLoop[EmailScoringAgent: Validate readability & professionalism]
    GradeLoop -->|Score < 70 & Attempt < 3| GradeLoop
    GradeLoop -->|Score >= 70 or Attempt = 3| DB_Email[(Save Email Draft in DB)]
    
    DB_Email --> UserReview[User Reviews Draft in Split Editor]
    UserReview -->|AI Chat Prompt| EditAgent[EmailEditingAgent: Modify text live]
    UserReview -->|One-click Tone Button| ToneAgent[ToneTransformationAgent: Change tone]
    UserReview -->|Select alternative subject| DB_Email
    
    UserReview -->|Click Save| SaveDraft[Save Draft in DB]
    UserReview -->|Click Copy / Export| End([Copy / Export Email])
```

---

## 2. Step-by-Step Sequence Diagrams

### A. Resume Upload & Parsing Flow
This flow details how a user's resume file (PDF, DOCX, TXT) is processed, analyzed, and stored.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as resumeController
    participant A as ResumeAnalysisAgent
    participant DB as MongoDB (Resume Collection)

    User->>C: POST /api/resume/upload { file }
    C->>A: run(fileBuffer, fileType)
    A->>A: extractText(fileBuffer, fileType)
    Note over A: PDFParse class or mammoth
    A->>A: analyze(resumeText)
    Note over A: Groq Llama 3.3 extraction
    A-->>C: { rawText, profile }
    C->>DB: Resume.create(parsedProfile)
    DB-->>C: Saved Resume Document
    C-->>User: HTTP 201 { resume }
```

### B. Job Analysis Flow
This flow details how a job URL is analyzed and scraped.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as jobController
    participant A as JobAnalysisAgent
    participant T as WebScraperTool
    participant DB as MongoDB (Job Collection)

    User->>C: POST /api/jobs/analyze { url }
    C->>A: analyze(url)
    A->>T: scrape(url)
    T-->>A: Raw text body
    A->>A: Prompts Groq for JSON job details
    A-->>C: Structured job object
    C->>DB: Job.create()
    DB-->>C: Saved Job Document
    C-->>User: HTTP 200 { job }
```

### C. Full Email Generation & Quality Flow
This diagram details the sequence when running the full pipeline end-to-end.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as generateController
    participant JAA as JobAnalysisAgent
    participant CMA as CandidateMatchingAgent
    participant EGA as EmailGenerationAgent
    participant ESA as EmailScoringAgent
    participant DB as MongoDB

    User->>C: POST /api/generate/full-pipeline { jobUrl, resumeId, userSummary, instructions }
    C->>JAA: analyze(jobUrl)
    JAA-->>C: jobAnalysis
    C->>C: Retrieve Resume
    C->>C: Save Job in DB
    C->>C: Match resume against job analysis
    C->>C: Spawn CandidateMatchingAgent
    C->>EGA: run(jobAnalysis, resume, matchAnalysis, summary, instructions)
    loop Up to 3 attempts
        EGA->>EGA: generate()
        EGA->>ESA: score(subject, content)
        ESA-->>EGA: scores (overallScore)
        alt overallScore >= 70 or attempt = 3
            Note over EGA: Exit Loop
        end
    end
    EGA->>EGA: generateSubjectLines()
    EGA-->>C: { subject, content, subjectOptions, qualityScores }
    C->>DB: Email.create()
    DB-->>C: Saved Email document
    C-->>User: HTTP 200 { email, jobAnalysis, matchAnalysis }
```

### D. AI Chat Editor Flow
Handles updating drafts live in response to conversational prompts.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as generateController
    participant E as EmailEditingAgent
    participant DB as MongoDB

    User->>C: POST /api/generate/edit { emailId, instruction, chatHistory }
    C->>DB: Get Email
    DB-->>C: Email data
    C->>E: edit(content, subject, instruction, chatHistory, context)
    E-->>C: { subject, content, changeDescription }
    C->>DB: Save updated Email & push to version history
    DB-->>C: Saved document
    C-->>User: HTTP 200 { email, changeDescription }
```

### E. Tone Transformation Flow
Allows style presetting without affecting resume facts.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant C as generateController
    participant T as ToneTransformationAgent
    participant DB as MongoDB

    User->>C: POST /api/generate/tone { emailId, tone }
    C->>DB: Get Email
    DB-->>C: Email data
    C->>T: transform(content, subject, tone)
    T-->>C: { subject, content }
    C->>DB: Save updated Email & push version history
    DB-->>C: Saved document
    C-->>User: HTTP 200 { email }
```
