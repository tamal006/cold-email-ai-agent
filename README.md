# ColdMail AI Agent 📧🤖

A production-ready full-stack SaaS application that uses an AI agent to generate, validate, and send professional cold emails.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + ShadCN UI + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (Mongoose)
- **AI**: OpenAI + Groq
- **Email**: Nodemailer + Gmail SMTP

## Features

- 🤖 AI-powered email generation with quality validation
- 📊 Dashboard with stats and activity charts
- 📧 One-click email sending via Gmail SMTP
- ✅ Quality scoring (grammar, readability, professionalism, spam check)
- 📝 Draft saving and email history
- 🎯 Subject line optimizer (5 alternatives)
- 🎨 Email tone variations (Formal, Friendly, Startup)
- 📋 Pre-built templates (Internship, Job, Freelance, Collaboration, Networking)
- 🔐 JWT authentication
- 🌙 Dark mode
- 📱 Responsive design

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key
- Gmail account with App Password

## Installation

### 1. Clone and install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coldmail-agent
JWT_SECRET=your-secure-random-string-here
GROQ_API_KEY=sk-your-openai-api-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=ColdMail AI Agent
```

### 3. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Use that password as `SMTP_PASS`

### 4. Start the application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Open the app

Visit http://localhost:5173

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user (protected)

### AI Agent
- `POST /api/agent/generate` - Generate email via AI
- `POST /api/agent/send` - Send email via SMTP
- `POST /api/agent/draft` - Save/update draft
- `POST /api/agent/variations` - Generate tone variations
- `POST /api/agent/optimize-subject` - Generate alternative subjects

### Emails
- `GET /api/emails` - List emails (paginated, filterable)
- `GET /api/emails/stats` - Dashboard statistics
- `GET /api/emails/templates` - Get templates
- `GET /api/emails/:id` - Get single email
- `DELETE /api/emails/:id` - Delete email

## Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve the dist/ folder with any static server
```

### Environment Variables for Production

Set the same `.env` variables on your production server. Consider using:
- MongoDB Atlas for the database
- A proper JWT secret (32+ random characters)
- SSL/TLS for all connections

## Security Features

- JWT Authentication with expiry
- bcrypt password hashing (12 rounds)
- Helmet security headers
- Rate limiting (100 req/15min)
- Input validation (express-validator)
- CORS configuration
- Environment variable isolation
