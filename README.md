# TerminalHire

**Ask the candidate, not just the resume.**

*TerminalHire* is **Mrudul Bokade’s AI Representative** — an interactive recruiter-facing desktop environment that lets HR recruiters and interviewers explore a candidate beyond a traditional resume.

Instead of simply reading a CV, recruiters can open a simulated desktop, explore candidate resources, and interact with an AI-powered terminal to ask about Mrudul’s projects, skills, experience, strengths, career direction, and role fit.

---

## ✨ Current Features

### 🤖 AI Recruiter Assistant
- Groq-powered LLM integration using `llama-3.3-70b-versatile`
- Recruiter-aware third-person responses
- Strict candidate-data grounding
- Anti-hallucination constraints
- Fast-answer layer for common recruiter questions
- Project-aware technical explanations

### 🧠 Candidate Intelligence
- Structured JSON-based candidate knowledge base
- Candidate profile and education data
- Technical skills and proficiency levels
- Project information and technical challenges
- Personality and SWOC data
- Interview-oriented answers
- Conversation history / contextual follow-up questions

### ⚡ Streaming Chat
- Real-time streamed LLM responses
- Markdown rendering
- Quick recruiter prompts
- Copy responses
- Regenerate responses
- Clear conversation
- Intelligent loading / response states

### 🖥️ Interactive Desktop Environment
- macOS-inspired desktop interface
- Draggable application windows
- Window focus and z-index management
- Minimize / restore / close controls
- Centered window positioning
- Functional desktop shortcuts
- Floating interactive dock
- Real-time system clock
- Recruiter-mode TerminalHire application

### ✨ Interactive Visual System
- React Bits `ParticleText`
- React Bits `GradientWaves`
- React Bits `SpecularButton`
- Animated candidate identity
- Interactive particle hover effect
- Animated desktop wallpaper
- Glassmorphism-inspired UI
- Smooth window and dock interactions

### 🔗 Candidate Resources
- Resume
- Portfolio
- GitHub
- LinkedIn
- External resource windows

---

## 🏗️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Markdown
- Remark GFM
- Lucide React
- OGL
- React Bits components

### Backend

- Python
- FastAPI
- Pydantic
- Groq API
- Streaming responses

### Data Layer

- JSON-based candidate memory
- Structured profile data
- Project knowledge base
- Personality and SWOC datasets
- Interview answers
- Prompt-engineered candidate context

---

## 🧠 Architecture

```text
                         ┌──────────────────────┐
                         │      Recruiter       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   TerminalHire UI    │
                         │ React + Vite +       │
                         │ Tailwind             │
                         └──────────┬───────────┘
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                        ▼                       ▼
                Fast Answers             Streaming Chat
                        │                       │
                        └───────────┬───────────┘
                                    ▼
                         ┌──────────────────────┐
                         │   Prompt Builder     │
                         └──────────┬───────────┘
                                    ▼
                         ┌──────────────────────┐
                         │ Structured Candidate │
                         │       Data           │
                         └──────────┬───────────┘
                                    ▼
                         ┌──────────────────────┐
                         │      Groq LLM        │
                         │ Llama 3.3 70B        │
                         └──────────┬───────────┘
                                    ▼
                         ┌──────────────────────┐
                         │ Recruiter-facing     │
                         │ streamed response    │
                         └──────────────────────┘

```
--- 

## 📁 Project Structure

```text

TerminalHire/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── desktop/
│   │   │   ├── dock/
│   │   │   ├── terminal/
│   │   │   ├── ui/
│   │   │   └── windows/
│   │   ├── App.jsx
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── prompts/
│   └── requirements.txt
│
├── data/
│   ├── profile.json
│   ├── projects.json
│   ├── personality.json
│   ├── swoc.json
│   ├── constraints.json
│   └── interview_answers.json
│
│
└── README.md

```
---

## 💬 Example Recruiter Questions

- Tell me about this candidate
- What are his strongest projects?
- Explain PacketSentry in detail
- Why should we hire this candidate?
- What skills are missing for a cloud role?
- Which project was the hardest and why?

---

## 🎨 Design Philosophy

TerminalHire is intentionally designed as more than a conventional portfolio.

The interface combines:

```text
                Professional Desktop
                        +
                Developer Terminal
                        +
                AI Recruiter Assistant
                        +
                Interactive Candidate Profile

```
The goal is to make the recruiter feel like they are exploring the candidate’s professional environment, rather than reading another static portfolio.

---

## 🚧 Roadmap

Upcoming features include:

- Job Description upload (PDF / DOCX)
- Job-description suitability scoring
- Skill-gap analysis
- Recruiter recommendation
- Resume upload and dynamic parsing
- Interview question generation
- Recruiter interview mode
- Conversation / analysis export to PDF
- Expanded terminal command system
- Additional candidate application windows
- Further mobile and performance optimization

---

## 📌 Status

Active development

The core AI backend, streaming chat system, structured candidate knowledge base, and interactive desktop frontend are currently functional.

The project is being developed incrementally with a focus on:

- clean architecture
- maintainable component design
- real recruiter utility
- performance
- polished interaction design