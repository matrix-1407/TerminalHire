# TerminalHire

**Ask the candidate, not just the resume.**

*TerminalHire* is **Mrudul Bokade’s AI Representative** — an interactive recruiter-facing desktop environment that lets HR recruiters and interviewers explore a candidate beyond a traditional resume.

Instead of simply reading a CV, recruiters can open a simulated desktop environment, explore candidate application windows, upload a Job Description (JD) for instant suitability scoring, and interact with a developer-style terminal (**Ask Me**) to evaluate Mrudul’s projects, technical skills, experience, strengths, career direction, and role fit.

---

## ✨ Core Features

### 🤖 AI Recruiter Assistant
- Groq-powered LLM integration using `llama-3.3-70b-versatile`
- Recruiter-aware third-person responses
- Strict candidate-data grounding with anti-hallucination constraints
- Zero-token Fast-Answer layer for instant preset command responses
- Project-aware technical explanations and architecture breakdowns

### 📄 Job Description Upload & Deterministic Suitability Engine
- Upload or drag-and-drop `.txt`, `.pdf`, and `.docx` job descriptions
- Multi-format text extraction (`pypdf` for PDF, `python-docx` for DOCX)
- Deterministic 0–100 suitability score calculation
- Fit rating classification (`Strong Fit`, `Moderate Fit`, `Weak Fit`)
- Matched skills and missing skill gap analysis
- Relevant project matching and recruiter recommendation summary
- Interactive recruiter AI follow-up actions (Score explanation, 30-day learning roadmap, interview question generator, detailed Resume-vs-JD comparison)

### 💻 Warp/iTerm2 Developer Terminal (`Ask Me`)
- Developer terminal transcript (`$ recruiter` in cyan, `$ ask-me` in green Markdown)
- Blinking block cursor (`█`) during streaming responses
- Interactive command set grid (`$help`, `$overview`, `$strengths`, `$projects`, `$impact`, `$interview`, `$fit`, `$resume`, `$github`, `$linkedin`, `$contact`, `$clear`) with 100% clickable command execution
- Contextual smart follow-up suggestion chips
- Long-response expand/collapse preview (`Show more` / `Show less`)
- Minimalist input bar with integrated file upload button and live loading stage indicators

### 🖥️ macOS Desktop & Application Windows
- macOS-inspired desktop interface with menu bar, realtime clock, and top navigation
- Responsive draggable windows with GPU-accelerated `translate3d` 60–120 FPS performance
- Window focus, z-index management, minimize, maximize, and close controls
- Dedicated candidate presentation windows:
  - **About Me**: Candidate background, education (B.E. ENTC, CGPA 8.0), relocation status, strengths, and work approach
  - **Projects**: Flagship project showcase featuring **VectorDB** (Local HNSW Vector Engine & RAG from scratch), **PacketSentry** (Deep Packet Inspection), **PharmaGuard**, **NyaySetu**, **TerminalHire**, and **Portfolio Website**
  - **Skills**: Categorized technical expertise across Backend, Cloud & DevOps, Networking, Security, and AI/RAG Systems
  - **Contact**: Compact, creative contact card with email copy feedback (`mrudulbokade1407@gmail.com`), `mailto:` action, and social cards
- Floating interactive dock powered by `motion/react` spring physics

### 🎨 Visual & Performance Engineering
- React Bits `GradientWaves` 3D WebGL background layer optimized for zero GPU stutter
- React Bits `ParticleText` candidate identity hero banner
- React Bits `SpecularButton` WebGL edge highlights on desktop icons
- Custom Developer Prompt & AI Spark (`>_`) SVG favicon
- Complete SEO optimization (Title tags, meta descriptions, OpenGraph, Twitter Cards, theme color, JSON-LD Schema markup)

### 🔗 Candidate External Resources
- Resume
- Portfolio
- GitHub
- LinkedIn
- External resource windows

---

## 🏗️ Tech Stack

### Frontend
- **Framework & Build**: React, Vite
- **Styling & Icons**: Tailwind CSS, Lucide React
- **Typography & Markdown**: Google Fonts (`JetBrains Mono`, `Inter`), React Markdown, Remark GFM
- **Animation & 3D**: `motion/react` (Motion), OGL (WebGL)
- **UI Components**: React Bits (`GradientWaves`, `ParticleText`, `SpecularButton`)

### Backend
- **Framework**: Python 3.10+, FastAPI
- **LLM Engine**: Groq API (`llama-3.3-70b-versatile`), Server-Sent Events (SSE) Streaming
- **Document Parsers**: `pypdf` (PDF processing), `python-docx` (Word processing)
- **Data Validation**: Pydantic
- **Groq API**
- **Streaming responses**

### Data Layer

- JSON-based candidate memory
- Structured profile data
- Project knowledge base
- Personality and SWOC datasets
- Interview answers
- Prompt-engineered candidate context
- Deterministic fast-answer mapping layer
- System-prompt candidate context injection

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
                         │ Tailwind + Motion    │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      Fast Answers /          JD Document            Streaming Chat
      Preset Commands          Parser                (Groq Llama 3.3)
   (0 Tokens, Instant)     (PDF/DOCX/TXT)                  │
             │                      │                      │
             │                      ▼                      │
             │             Deterministic Score             │
             │             & Skill Gap Engine              │
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Prompt & Candidate   │
                         │    Knowledge Base    │
                         └──────────┬───────────┘
                                    │
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
                         │ Streamed Terminal    │
                         │  Recruiter Response  │   
                         │ Streamed Terminal    │
                         │  Recruiter Response  |
                         └──────────────────────┘

```

---

## 📁 Project Structure

```text
TerminalHire/
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Developer Prompt & AI Spark SVG Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── desktop/          # DesktopShell, MenuBar
│   │   │   ├── dock/             # Motion Dock & Dock items styling
│   │   │   ├── terminal/         # TerminalWindow, JDUploadButton, JDResultCard, JDScoreRing
│   │   │   ├── ui/               # GradientWaves, ParticleText, SpecularButton
│   │   │   └── windows/          # Window chrome, AboutMe, Projects, Skills, Contact, External
│   │   ├── App.jsx               # macOS Window Manager & Desktop Shell composition
│   │   └── main.jsx
│   ├── index.html                # SEO Meta, OpenGraph, JSON-LD Schema
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── models/               # Pydantic chat request & JD models
│   │   ├── routes/               # FastAPI endpoints (/api/chat, /api/chat/stream, /api/jd/analyze)
│   │   ├── services/             # Fast answers, Groq LLM service, JD analyzer
│   │   └── prompts/              # System prompt builder & candidate grounding
│   └── requirements.txt
│
├── data/
│   ├── profile.json              # Candidate identity, education & background
│   ├── projects.json             # VectorDB, PacketSentry, PharmaGuard, NyaySetu, TerminalHire
│   ├── personality.json          # Strengths & work style
│   ├── swoc.json                 # Strengths, Weaknesses, Opportunities, Challenges
│   ├── constraints.json          # Anti-hallucination & third-person rules
│   └── interview_answers.json   # Enriched Markdown fast answers for preset commands
│
└── README.md
```

---

## 💬 Example Recruiter Commands & Questions

Recruiters can type or click commands directly in the **Ask Me** terminal:

- `$help` — Display 2-column interactive command set table
- `$overview` — 30-second candidate summary & target roles
- `$strengths` — Core technical & systems engineering strengths
- `$projects` — Flagship projects (**VectorDB**, **PacketSentry**, **PharmaGuard**, **TerminalHire**)
- `$impact` — Key recruiter talking points & engineering impact
- `$interview` — Generate recruiter-ready interview questions with answer criteria
- `$fit` — Role-fit evaluation across Backend, Cloud, AI, and Security
- `$resume` — Open candidate background & resume details
- `$github` — View open-source repositories ([github.com/matrix-1407](https://github.com/matrix-1407))
- `$contact` — View candidate email (`mrudulbokade1407@gmail.com`) and contact links
- `$clear` — Clear terminal transcript

Recruiters can also ask custom natural language questions or upload any Job Description file!

---

## 🎨 Design Philosophy

TerminalHire is intentionally designed as more than a conventional portfolio.

The interface combines:

```text
                Professional Desktop OS
                          +
                Developer Terminal
                          +
                AI Recruiter Representative
                          +
                Deterministic JD Suitability Engine
```

The goal is to make recruiters feel like they are exploring a candidate’s live developer workstation, evaluating real technical capabilities through streaming conversation and data-driven job description scoring.

---

## 📌 Status

**Project Complete / Production Ready**

All planned features—including streaming LLM interaction, deterministic JD suitability scoring, multi-format file parsing, preset developer command system, macOS window manager, candidate presentation windows, WebGL performance optimizations, and SEO optimization—are 100% completed and fully functional.

---

*Engineered from scratch with system-level precision, zero cloud latency, and pure developer passion by **[Mrudul Bokade](https://github.com/matrix-1407)**. ⚡*