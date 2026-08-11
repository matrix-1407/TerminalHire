# TerminalHire

**Ask the candidate, not just the resume.**

*TerminalHire* is **Mrudul’s AI Representative** for HR recruiters and interviewers that allows them to interact with a candidate through a conversational interface.

Instead of scanning a resume, users can ask questions about the candidate's projects, skills, experience, strengths, career goals, and role fit.

---

## Current Features

- 🤖 Groq-powered AI chat (`llama-3.3-70b-versatile`)
- 🧠 Conversation memory
- 🧾 Structured candidate knowledge base
- 🛡️ Anti-hallucination guardrails
- 👔 Recruiter-aware third-person responses
- ⚡ Fast answers for common interview questions
- 📂 Project-aware technical explanations
- 🔌 FastAPI backend with modular architecture

---

## 🏗️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Pydantic
- Groq API

### Data Layer
- JSON-based candidate memory
- Structured profile, project, personality, and interview datasets

---

## Example Questions

- Tell me about this candidate
- What are his strongest projects?
- Explain PacketSentry in detail
- Why should we hire this candidate?
- What skills are missing for a cloud role?
- Which project was the hardest and why?

---

## 📁 Project Structure

```text
TerminalHire/
├── frontend/        # React + Tailwind UI
├── backend/         # FastAPI API and AI engine
├── data/            # Structured candidate datasets
└── README.md
```

---

## 🧠 Architecture

```text
User
  ↓
Fast-answer layer
  ↓
Prompt builder
  ↓
Structured candidate data
  ↓
Groq LLM
  ↓
Recruiter-facing response
```

---

## 🚧 In Progress

- Streaming responses
- Desktop + terminal-style UI
- Job description matching
- Resume upload and parsing
- Interview question generation
- Chat export to PDF
- Mobile optimization

---

## 📌 Status

**Active development — backend AI engine is functional and integrated with Groq. Frontend is currently in development.**