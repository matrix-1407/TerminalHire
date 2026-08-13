import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";

import {
  Send,
  Copy,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Trash2,
} from "lucide-react";

import Window from "../windows/Window";
import ParticleText from "../ui/ParticleText";
import JDUploadButton from "./JDUploadButton";
import JDResultCard from "./JDResultCard";
import useJDUpload from "./useJDUpload";

const quickPrompts = [
  "Tell me about the candidate",
  "What are his strongest projects?",
  "Why should we hire him?",
  "What cloud skills does he have?",
  "Explain PacketSentry in detail",
];

const nowTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const projectChips = [
  "PacketSentry",
  "PharmaGuard",
  "NyaySetu",
  "FlickMate",
  "Portfolio Website",
];

function Message({
  role,
  content,
  time,
  source,
  type,
  analysis,
  onProjectClick,
  onRegenerate,
  onJDAction,
}) {

  const [expanded, setExpanded] = useState(false);

  const MAX_PREVIEW = 1200;

  const isLong =
    role === 'assistant' &&
    type !== 'jd-analysis' &&
    typeof content === 'string' &&
    content.length > MAX_PREVIEW;

  const displayContent =
    isLong && !expanded
      ? content.slice(0, MAX_PREVIEW)
      : content;

  if (type === "jd-analysis") {
    return (
      <div className="space-y-3 message-enter">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          terminalhire :: jd-analysis
        </div>
        <JDResultCard 
          analysis={analysis} 
          onAction={onJDAction}
        />
      </div>
    );
  }

  if (type === "system") {
    return (
      <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-3 text-sm text-cyan-100 message-enter">
        {content}
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="rounded-2xl border border-red-300/20 bg-red-300/[0.08] px-4 py-3 text-sm text-red-100 message-enter">
        {content}
      </div>
    );
  }

  const copy = () => navigator.clipboard.writeText(content);

  return (
    <div className="space-y-3 message-enter">
      <div
        className={clsx(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          role === "user" ? "text-cyan-300" : "text-emerald-300"
        )}
      >
        {role === "user" ? "> recruiter" : "terminalhire :: recruiter-mode"}
      </div>

      <div className="group relative rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white/45">{time}</span>

            {source === "fast-answer" && (
              <span className="rounded-full bg-emerald-400/10 text-emerald-300 px-2 py-0.5 border border-emerald-400/20">
                Fast answer
              </span>
            )}

            {source === "llm" && role === "assistant" && (
              <span className="rounded-full bg-cyan-400/10 text-cyan-300 px-2 py-0.5 border border-cyan-400/20">
                LLM
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {role === "assistant" && (
              <button
                onClick={onRegenerate}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Regenerate response"
              >
                <RotateCcw size={16} />
              </button>
            )}

            {role === "assistant" && content && (
              <button
                onClick={copy}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Copy response"
              >
                <Copy size={16} />
              </button>
            )}
          </div>
        </div>

        {role === "assistant" ? (
          <div className={`prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-white/90 prose-li:text-white/90 prose-strong:text-white prose-code:text-cyan-200 prose-code:bg-cyan-400/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 transition-all duration-300 ${isLong && !expanded ? 'max-h-[28rem] overflow-hidden' : ''} `} >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>

            {isLong && (
             <button
               type="button"
               onClick={() => setExpanded((v) => !v)}
               className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cyan-200 transition hover:bg-white/10 hover:text-cyan-100"
              >
               {expanded ? 'Show less' : 'Show more'}
             </button>
            )}
            
            {content && (
              <span className="inline-block w-2 h-5 ml-1 align-middle bg-cyan-300 animate-pulse rounded-sm" />
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap leading-7 text-white/90 text-[15px]">
            {content}
          </div>
        )}

        {role === "assistant" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {projectChips
              .filter((p) => content.toLowerCase().includes(p.toLowerCase()))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => onProjectClick?.(p)}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-400/20 transition-colors"
                >
                  {p}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TerminalWindow({
  title = "terminalhire :: recruiter-mode",
  zIndex,
  defaultPosition,
  onFocus,
  onMinimize,
  onClose,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const dragDepth = useRef(0);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const pushSystemMessage = (content, type = "system") => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content,
        time: nowTime(),
        source: "jd-upload",
        type,
      },
    ]);
  };

  const { uploading, progress, analyzeFile } = useJDUpload({
    onComplete: (analysis) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          time: nowTime(),
          source: "jd-analysis",
          type: "jd-analysis",
          analysis,
        },
      ]);
    },
    onError: (message) => pushSystemMessage(message, "error"),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  const sendMessage = async (preset) => {
    const text = (preset ?? input).trim();
    const visibleText = preset ? null : text;
    if (!text || loading) return;

      const userMessage = visibleText
          ? {
              role: 'user',
              content: visibleText,
              time: nowTime(),
              source: 'recruiter',
            }
          : null;
          
        const history = userMessage ? [...messages, userMessage] : messages;
          
        if (userMessage) {
          setMessages(history);
      }
    setInput("");
    setLoading(true);

    const stages = [
      "Reading candidate profile…",
      "Checking project knowledge…",
      "Preparing response…",
    ];

    let stageIndex = 0;
    setStage(stages[0]);

    const interval = setInterval(() => {
      stageIndex = Math.min(stageIndex + 1, stages.length - 1);
      setStage(stages[stageIndex]);
    }, 1200);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        time: nowTime(),
        source: "llm",
      },
    ]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: messages,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: fullText,
          };
          return updated;
        });
      }
    } finally {
      clearInterval(interval);
      setStage("");
      setLoading(false);
    }
  };

  const buildJDPrompt = (action, result) => {
      const context = `
    Job Title: ${result.job_title}
    Score: ${result.score}
    Fit: ${result.fit}
    Matched Skills: ${result.matched_skills.join(', ')}
    Missing Skills: ${result.missing_skills.join(', ')}
    Relevant Projects: ${result.relevant_projects.map(p => p.name).join(', ')}
    Summary: ${result.summary}
    Recommendation: ${result.recommendation}
      `;

      switch (action) {
        case 'why_score':
          return `Explain in recruiter terms why this candidate received a ${result.score}/100 score for this JD. Break down skills, projects, and experience.

    ${context}`;

        case 'improve':
          return `Tell the candidate exactly what to improve in the next 30 days to become a stronger match for this role. Prioritize the highest-impact skills first.

    ${context}`;

        case 'strongest_project':
          return `Identify the single strongest project for this JD and explain why it is the best match, what technologies overlap, and what interview points a recruiter should explore.

    ${context}`;

        case 'interview_questions':
          return `Generate a concise recruiter-ready interview pack for this JD.

        Requirements:
        - 3 technical questions
        - 2 behavioral questions
        - For each question, give only 1-2 bullets describing what a strong answer should include.
        - Keep the entire response under 250 words.

    ${context}`;

        case 'compare':
          return `Provide a detailed resume-vs-JD comparison with sections: Strong match, Partial match, Missing skills, Project alignment, Cloud alignment, Security/networking alignment, and Final hiring assessment.

    ${context}`;

        default:
          return `Analyze this JD match.

    ${context}`;
      }
  };

  const handleJDAction = async (action, result) => {
    const prompt = buildJDPrompt(action, result);

    const labels = {
      why_score: 'Why this score?',
      improve: 'What should improve?',
      strongest_project: 'Which project is the strongest match?',
      interview_questions: 'Generate interview questions for this JD',
      compare: 'Compare resume vs JD in detail',
    };

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: labels[action] || 'Analyze this JD',
        time: nowTime(),
        source: 'recruiter',
      },
    ]);

    await sendMessage(prompt);
  };

  const hasMessages = messages.length > 0;

  const handleFile = (file) => {
    if (!file || uploading) return;
    pushSystemMessage(`Analyzing ${file.name} for candidate suitability...`);
    analyzeFile(file);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current += 1;
    if (event.dataTransfer?.items?.length) {
      setDragActive(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = 0;
    setDragActive(false);
    handleFile(event.dataTransfer?.files?.[0]);
  };

  return (
    <Window
      title={title}
      zIndex={zIndex}
      defaultPosition={defaultPosition}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
      headerActions={
        <>
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
          >
            <Trash2 size={14} />
            Clear
          </button>

          <div className="flex items-center gap-2 text-xs text-cyan-300/90 font-medium">
            <Sparkles size={14} />
            LIVE
          </div>
        </>
      }
    >
      <div
        className={clsx(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden transition-colors duration-200",
          dragActive && "bg-cyan-300/[0.04]"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragActive && (
          <div className="pointer-events-none absolute inset-3 z-20 flex items-center justify-center rounded-3xl border border-dashed border-cyan-300/60 bg-slate-950/70 text-center backdrop-blur-sm">
            <div className="space-y-2 px-6">
              <div className="text-lg font-semibold text-cyan-100">Drop JD to analyze</div>
              <div className="text-sm text-white/60">PDF, DOCX, or TXT up to 5 MB</div>
            </div>
          </div>
        )}

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {!hasMessages ? (
          <div className="h-full flex items-center justify-center">
            <div className="max-w-2xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                <Sparkles size={16} />
                AI Representative for Mrudul Bokade
              </div>

              <div className="space-y-3">
                <div className="h-44 md:h-48 overflow-hidden rounded-2xl border border-cyan-300/15 bg-black/20">
                  <ParticleText
                    text="WELCOME"
                    particleSize={2.4}
                    density={3}
                    color="#f8fafc"
                    highlightColor="#67e8f9"
                    scatter={70}
                    gatherDuration={700}
                    stagger={220}
                    pointerRepel={0}
                    repelRadius={0}
                    idleDrift={0.2}
                    trigger="hover"
                    fontSize="clamp(2.8rem, 6vw, 4.2rem)"
                    fontWeight={700}
                    fontFamily="Inter, system-ui, sans-serif"
                    glow
                    className="w-full h-full"
                  />
                </div>

                <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
                  Ask the candidate,
                  <br />
                  <span className="text-cyan-300">not just the resume.</span>
                </h1>

                <p className="text-white/65 text-lg leading-8 max-w-xl mx-auto">
                  Explore projects, skills, cloud experience, AI work, networking
                  knowledge, technical strengths, and role fit through a conversational
                  interface.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/85 hover:bg-white/[0.08] hover:border-cyan-400/30 transition-all duration-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <Message
                key={idx}
                role={msg.role}
                content={msg.content}
                time={msg.time}
                source={msg.source}
                type={msg.type}
                analysis={msg.analysis}
                onProjectClick={(text) => sendMessage(text)}
                onJDAction={handleJDAction}
                onRegenerate={() => {
                  const lastUser = [...messages]
                    .reverse()
                    .find((m) => m.role === "user");
                  if (lastUser) sendMessage(lastUser.content);
                }}
              />
            ))}

            {loading && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {stage || "Preparing response…"}
                </div>

                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <CheckCircle2 size={16} />
                  Context loaded
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      <div className="border-t border-white/10 bg-black/20 p-4">
        <div className="rounded-3xl border border-white/10 bg-black/30 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-end gap-3">
            <JDUploadButton onSelectFile={handleFile} disabled={uploading} />

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about projects, skills, cloud, AI, networking, or role fit…"
              className="flex-1 bg-transparent outline-none resize-none text-white placeholder:text-white/40 min-h-[24px] max-h-40 text-[15px] leading-7 overflow-y-auto"
              rows={1}
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="h-11 px-4 rounded-2xl bg-cyan-400 text-black font-semibold disabled:opacity-40 hover:bg-cyan-300 transition-all duration-200 flex items-center gap-2 shadow-[0_8px_24px_rgba(34,211,238,0.25)]"
            >
              <Send size={16} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>

          {uploading && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10" aria-label="JD analysis progress">
              <div
                className="h-full rounded-full bg-cyan-300 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="mt-3 flex flex-col gap-1 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <span>Enter to send - Shift+Enter for a new line - Drop a JD to analyze</span>
            <span>{uploading ? "Analyzing JD..." : "Groq - Llama 3.3 70B"}</span>
          </div>
        </div>
      </div>
      </div>
    </Window>
  );
}
