# MailCraft AI 📧🤖

A production-ready full-stack SaaS application that generates highly personalized cold outreach emails for job applications by matching an uploaded resume (PDF/DOCX/TXT) against target job posting URLs (LinkedIn, Naukri, Internshala, corporate career pages, etc.).

---

## 🚀 Tech Stack

- **Frontend**: React 18 + Tailwind CSS v3 + Radix UI / ShadCN + Vite
- **Backend**: Node.js + Express (ES Modules)
- **Database**: MongoDB (Mongoose)
- **AI**: OpenAI GPT-4o
- **Email**: Nodemailer + Gmail SMTP

## ✨ Features

- 🤖 **Multi-Agent Pipeline**: Scraping → Resume Parsing → Candidate Matching → Copywriting → Quality Grading.
- 📄 **Resume Parsing**: Drag-and-drop resume uploader extracting details automatically.
- ⚡ **ATS-Style Alignment**: Matching score, matching/missing skills lists, strengths, and weaknesses.
- 🎨 **One-Click Tone Converter**: 9 tone presets (`startup style`, `corporate`, `minimal`, etc.) to instantly rewrite outreach emails.
- ✏️ **AI Chat Editor**: Refine output copy using natural language chat commands.
- 📋 **Quality Auditing**: Breakdown of CTA strength, spam risk, personalization, readability, and grammar.
- 📝 **Subject Line Optimizer**: Generates 5 alternative subject line options.
- 🌙 **Dark Mode & Premium UI**: Responsive glassmorphism interface.

---

## 📦 Directory Structure

- `/backend`: Node.js API server running on port 5000. Uses Mongoose models, Express controllers, and AI Agents/Tools.
- `/frontend`: React client running on port 5173. Built using Vite, Tailwind, and ShadCN.
- `/docs`: Comprehensive architectural, database, agent, and API guides.

---

## 🛠️ Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- OpenAI API key
- Gmail account with App Password

## ⚙️ Local Installation

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coldmail-agent
JWT_SECRET=your-secure-random-string-here
OPENAI_API_KEY=sk-your-openai-api-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=ColdMail AI Agent
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🛡️ Security

- **Bcrypt Hashing**: User credentials hashed with 12 rounds.
- **JWT Authorization**: Authenticated API routes.
- **Rate Limiting**: Protects endpoints from burst spikes.
- **Helmet**: Strengthens HTTP header security.
