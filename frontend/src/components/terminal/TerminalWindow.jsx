import { useEffect, useRef, useState, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Send,
  Copy,
  Sparkles,
  RotateCcw,
  Trash2,
  Terminal,
  Cpu,
  Database,
  Search,
  LoaderCircle,
  CornerDownLeft,
} from "lucide-react";

import Window from "../windows/Window";
import JDUploadButton from "./JDUploadButton";
import JDResultCard from "./JDResultCard";
import useJDUpload from "./useJDUpload";
import { API_BASE_URL } from "../../config/api";

const nowTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const commandList = [
  { cmd: "overview", desc: "30-second candidate summary", prompt: "Give me a 30-second candidate summary of Mrudul" },
  { cmd: "strengths", desc: "Top technical strengths", prompt: "What are Mrudul's top technical strengths?" },
  { cmd: "projects", desc: "Flagship projects", prompt: "Tell me about his flagship projects in detail" },
  { cmd: "impact", desc: "Recruiter talking points", prompt: "What are the key recruiter talking points and business impact for Mrudul?" },
  { cmd: "interview", desc: "Generate interview questions", prompt: "Generate a recruiter interview pack with technical and behavioral questions" },
  { cmd: "fit", desc: "Role-fit evaluation", prompt: "Evaluate Mrudul's role-fit across backend, cloud, DevOps, and AI" },
  { cmd: "resume", desc: "Resume link", prompt: "Provide details on Mrudul's resume and background" },
  { cmd: "linkedin", desc: "LinkedIn profile", prompt: "What is Mrudul's LinkedIn profile and professional network?" },
  { cmd: "github", desc: "GitHub repositories", prompt: "What are Mrudul's main GitHub repositories and open-source contributions?" },
  { cmd: "contact", desc: "Contact links", prompt: "How can I contact Mrudul or view his portfolio?" },
  { cmd: "clear", desc: "Clear terminal", action: "clear" },
];

function getSuggestions({ type, content = "", analysis }) {
  if (type === "jd-analysis") {
    const score = analysis?.score ?? 0;
    if (score >= 80) {
      return [
        "Generate a technical interview pack",
        "What makes this a strong fit?",
        "Write a recruiter decision summary",
      ];
    }
    if (score >= 60) {
      return [
        "Why is the score not higher?",
        "What should improve in 30 days?",
        "Should a recruiter still interview him?",
      ];
    }
    return [
      "What are the biggest gaps?",
      "Create a learning roadmap",
      "Which project is most relevant?",
    ];
  }

  const text = content.toLowerCase();

  if (
    text.includes("packetsentry") &&
    (text.includes("dpi") ||
      text.includes("network") ||
      text.includes("traffic") ||
      text.includes("pcap"))
  ) {
    return [
      "Explain PacketSentry architecture",
      "Ask a networking interview question",
      "Compare it with a cloud-security role",
    ];
  }

  if (
    text.includes("aws") ||
    text.includes("docker") ||
    text.includes("kubernetes") ||
    text.includes("deployment")
  ) {
    return [
      "Check cloud gaps for this role",
      "Ask a deployment interview question",
      "Generate a production scenario question",
    ];
  }

  if (
    text.includes("fastapi") ||
    text.includes("api") ||
    text.includes("backend") ||
    text.includes("rest")
  ) {
    return [
      "Explain API design choices",
      "Ask a backend interview question",
      "What scalability concerns exist?",
    ];
  }

  if (
    text.includes("rag") ||
    text.includes("llm") ||
    text.includes("ai") ||
    text.includes("vector")
  ) {
    return [
      "Explain the RAG pipeline",
      "Ask an AI interview question",
      "What are the hallucination risks?",
    ];
  }

  if (text.includes("score") || text.includes("fit")) {
    return [
      "Why not 100?",
      "What is the strongest project?",
      "Should a recruiter still interview him?",
    ];
  }

  return [
    "Explain this in simpler terms",
    "Give a recruiter-focused summary",
    "What should I ask next?",
  ];
}

function TranscriptMessage({
  role,
  content,
  time,
  type,
  analysis,
  isLast,
  isStreaming,
  onSuggestionClick,
  onRegenerate,
  onJDAction,
  onCommandClick,
}) {
  const [expanded, setExpanded] = useState(false);
  const MAX_PREVIEW = 1200;

  const isLong =
    role === "assistant" &&
    type !== "jd-analysis" &&
    type !== "command-grid" &&
    typeof content === "string" &&
    content.length > MAX_PREVIEW;

  const displayContent =
    isLong && !expanded ? content.slice(0, MAX_PREVIEW) : content;

  if (type === "command-grid") {
    return (
      <div className="space-y-3 py-2.5 message-enter font-mono">
        <div className="flex items-center justify-between text-xs border-b border-cyan-500/20 pb-2 select-none">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">$ ask-me</span>
            <span className="text-cyan-300 font-bold">--help</span>
          </div>
          <span className="text-white/30 text-[10px]">{time}</span>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-white/70">
            Interactive Command Set — Click any command below to execute:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {commandList.map((item) => (
              <button
                key={item.cmd}
                type="button"
                onClick={() => onCommandClick?.(item)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-cyan-950/50 hover:border-cyan-400/50 group text-left transition-all duration-150 cursor-pointer active:scale-98"
              >
                <span className="text-cyan-300 font-bold group-hover:text-cyan-200 text-xs">
                  ${item.cmd}
                </span>
                <span className="text-white/50 text-[11px] group-hover:text-white/80 truncate ml-2">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "jd-analysis") {
    return (
      <div className="space-y-2 py-2 message-enter">
        <div className="font-mono text-xs text-emerald-400 font-semibold tracking-wider">
          $ ask-me --analyze-jd
        </div>
        <JDResultCard analysis={analysis} onAction={onJDAction} />
      </div>
    );
  }

  if (type === "system") {
    return (
      <div className="font-mono text-xs text-cyan-300/80 py-1.5 message-enter flex items-center gap-2">
        <span className="text-cyan-500">ℹ</span>
        <span>{content}</span>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="font-mono text-xs text-red-400 py-1.5 message-enter flex items-center gap-2">
        <span className="text-red-500">✖</span>
        <span>{content}</span>
      </div>
    );
  }

  const suggestions =
    role === "assistant" && !isStreaming
      ? getSuggestions({ type, content, analysis })
      : [];

  const copyToClipboard = () => navigator.clipboard.writeText(content);

  return (
    <div className="space-y-1.5 py-2 message-enter">
      {/* Prompt Prefix */}
      <div className="flex items-center justify-between font-mono text-xs select-none">
        <div className="flex items-center gap-2">
          {role === "user" ? (
            <span className="text-cyan-400 font-semibold">$ recruiter</span>
          ) : (
            <span className="text-emerald-400 font-semibold">$ ask-me</span>
          )}
          <span className="text-white/30 text-[10px]">{time}</span>
        </div>

        {role === "assistant" && content && !isStreaming && (
          <div className="flex items-center gap-2 text-white/40 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={onRegenerate}
              className="hover:text-white transition-colors"
              title="Regenerate"
              aria-label="Regenerate response"
            >
              <RotateCcw size={13} />
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="hover:text-white transition-colors"
              title="Copy"
              aria-label="Copy response"
            >
              <Copy size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Transcript Body */}
      <div className="pl-4 border-l border-white/[0.06] group">
        {role === "assistant" ? (
          <>
            <div className="text-sm leading-relaxed text-white/90 font-sans">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-base sm:text-lg font-bold text-cyan-200 mt-4 mb-2 border-b border-cyan-500/20 pb-1" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-sm sm:text-base font-bold text-cyan-300 mt-3 mb-1.5" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider mt-3 mb-1" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-2.5 text-white/95 leading-relaxed font-normal" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-cyan-200" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-outside pl-4 space-y-1.5 mb-3 text-white/90" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-outside pl-4 space-y-1.5 mb-3 text-white/90" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-white/90 leading-relaxed" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-cyan-300 font-semibold underline underline-offset-2 hover:text-cyan-200 transition-colors" target="_blank" rel="noreferrer" {...props} />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code className="font-mono text-[11px] bg-cyan-950/70 text-cyan-200 px-1.5 py-0.5 rounded border border-cyan-500/30" {...props} />
                    ) : (
                      <code className="block font-mono text-[11px] bg-slate-950/90 text-cyan-200 p-3 rounded-xl border border-white/10 my-2.5 overflow-x-auto" {...props} />
                    ),
                }}
              >
                {displayContent}
              </ReactMarkdown>
            </div>

            {/* Blinking Block Cursor while streaming */}
            {isLast && isStreaming && <span className="terminal-cursor" />}

            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 font-mono text-xs text-cyan-300 hover:underline inline-flex items-center gap-1"
              >
                {expanded ? "↑ Show less" : "↓ Show more..."}
              </button>
            )}
          </>
        ) : (
          <div className="font-mono text-sm text-cyan-100 whitespace-pre-wrap">
            {content}
          </div>
        )}

        {/* Suggestion Chips */}
        {role === "assistant" && suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggestionClick?.(s)}
                className="rounded-md font-mono text-[11px] px-2.5 py-1 border border-cyan-400/20 bg-cyan-400/5 text-cyan-200 hover:bg-cyan-400/15 hover:border-cyan-300/40 hover:text-cyan-100 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TerminalWindow({
  title = "ask-me — recruiter session",
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
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [input]);

  const handleCommandClick = (cmdItem) => {
    if (cmdItem.action === "clear") {
      setMessages([]);
      return;
    }
    if (cmdItem.prompt) {
      sendMessage(cmdItem.prompt);
    }
  };

  const sendMessage = async (preset) => {
    const text = (preset ?? input).trim();
    if (!text || loading) return;

    const rawLower = text.toLowerCase().trim();
    const normalized = rawLower.replace(/^\$/, '').replace(/^\//, '').replace(/\?$/, '').trim();

    // Check if typed exact help command
    const isExactHelp =
      normalized === "help" ||
      normalized === "commands" ||
      rawLower === "help?" ||
      rawLower === "$help?" ||
      rawLower === "help me" ||
      rawLower === "?" ||
      rawLower === "$?" ||
      rawLower === "$help" ||
      rawLower === "/help";

    if (isExactHelp) {
      setInput("");
      const userMsg = {
        role: "user",
        content: text,
        time: nowTime(),
        source: "recruiter",
      };
      const helpMsg = {
        role: "assistant",
        content: "TerminalHire OS — Interactive Command Set",
        time: nowTime(),
        source: "help-grid",
        type: "command-grid",
      };
      setMessages((prev) => [...prev, userMsg, helpMsg]);
      return;
    }

    // Check if typed exact command (with or without leading $ or /)
    const matchedCmd = commandList.find((c) => c.cmd === normalized || c.cmd === text.toLowerCase());
    if (matchedCmd) {
      if (matchedCmd.action === "clear") {
        setMessages([]);
        setInput("");
        return;
      }
      if (matchedCmd.prompt) {
        setInput("");
        await sendMessage(matchedCmd.prompt);
        return;
      }
    }

    const userMessage = {
      role: "user",
      content: text,
      time: nowTime(),
      source: "recruiter",
    };

    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setLoading(true);

    const stages = [
      "analyzing candidate memory",
      "resolving project data",
      "matching recruiter intent",
      "generating response",
    ];

    let stageIndex = 0;
    setStage(stages[0]);

    const interval = setInterval(() => {
      stageIndex = Math.min(stageIndex + 1, stages.length - 1);
      setStage(stages[stageIndex]);
    }, 1000);

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
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
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
    } catch (err) {
      pushSystemMessage("Connection error while communicating with AI service.", "error");
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
Matched Skills: ${result.matched_skills.join(", ")}
Missing Skills: ${result.missing_skills.join(", ")}
Relevant Projects: ${result.relevant_projects.map((p) => p.name).join(", ")}
Summary: ${result.summary}
Recommendation: ${result.recommendation}
    `;

    switch (action) {
      case "why_score":
        return `Explain in recruiter terms why this candidate received a ${result.score}/100 score for this JD. Break down skills, projects, and experience.\n${context}`;
      case "improve":
        return `Tell the candidate exactly what to improve in the next 30 days to become a stronger match for this role. Prioritize the highest-impact skills first.\n${context}`;
      case "strongest_project":
        return `Identify the single strongest project for this JD and explain why it is the best match, what technologies overlap, and what interview points a recruiter should explore.\n${context}`;
      case "interview_questions":
        return `Generate a concise recruiter-ready interview pack for this JD.\nRequirements:\n- 3 technical questions\n- 2 behavioral questions\n- For each question, give 1-2 bullets describing what a strong answer should include.\n- Keep response under 250 words.\n${context}`;
      case "compare":
        return `Provide a detailed resume-vs-JD comparison with sections: Strong match, Partial match, Missing skills, Project alignment, Cloud alignment, Security/networking alignment, and Final hiring assessment.\n${context}`;
      default:
        return `Analyze this JD match.\n${context}`;
    }
  };

  const handleJDAction = async (action, result) => {
    const prompt = buildJDPrompt(action, result);
    const labels = {
      why_score: "Why this score?",
      improve: "What should improve?",
      strongest_project: "Which project is the strongest match?",
      interview_questions: "Generate interview questions for this JD",
      compare: "Compare resume vs JD in detail",
    };

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: labels[action] || "Analyze this JD",
        time: nowTime(),
        source: "recruiter",
      },
    ]);

    await sendMessage(prompt);
  };

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-[11px] font-mono text-white/40 hover:text-white transition-colors flex items-center gap-1"
            title="Clear terminal transcript"
          >
            <Trash2 size={13} />
            clear
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/90 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </div>
        </div>
      }
    >
      <div
        className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#0a0d14] ${
          dragActive ? "bg-cyan-950/40" : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Terminal Drag and Drop Overlay */}
        {dragActive && (
          <div className="pointer-events-none absolute inset-3 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-cyan-400/70 bg-slate-950/90 text-center backdrop-blur-md">
            <div className="space-y-2 px-6 font-mono">
              <div className="text-base font-semibold text-cyan-200">
                ┌──────────────────────────────────────┐
              </div>
              <div className="text-sm font-bold text-white">
                Drop job description file here
              </div>
              <div className="text-xs text-cyan-300/70">
                PDF • DOCX • TXT (up to 5 MB)
              </div>
              <div className="text-base font-semibold text-cyan-200">
                └──────────────────────────────────────┘
              </div>
            </div>
          </div>
        )}

        {/* Terminal Main Transcript View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-mono select-text scrollbar-thin scrollbar-thumb-white/10">
          {/* Always show Terminal Header Intro */}
          <div className="space-y-2 pb-3 border-b border-white/[0.06] text-xs text-white/50">
            <div>ask-me — recruiter session</div>
            <div>Last login: {new Date().toDateString()}</div>
            <div>Type <span className="text-cyan-300">`help`</span> to explore candidate data</div>
          </div>

          {/* Empty state output / Help command table */}
          {messages.length === 0 && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-cyan-400 font-semibold">$ help</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pl-2 font-mono text-xs">
                {commandList.map((item) => (
                  <button
                    key={item.cmd}
                    type="button"
                    onClick={() => handleCommandClick(item)}
                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/[0.05] group text-left transition-colors cursor-pointer"
                  >
                    <span className="text-cyan-300 font-semibold group-hover:text-cyan-200">
                      {item.cmd}
                    </span>
                    <span className="text-white/45 text-[11px] group-hover:text-white/70 truncate ml-2">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages list */}
          {messages.map((msg, idx) => (
            <TranscriptMessage
              key={idx}
              role={msg.role}
              content={msg.content}
              time={msg.time}
              type={msg.type}
              analysis={msg.analysis}
              isLast={idx === messages.length - 1}
              isStreaming={loading && idx === messages.length - 1}
              onSuggestionClick={(prompt) => sendMessage(prompt)}
              onRegenerate={() => {
                const lastUser = [...messages]
                  .reverse()
                  .find((m) => m.role === "user");
                if (lastUser) sendMessage(lastUser.content);
              }}
              onJDAction={handleJDAction}
              onCommandClick={handleCommandClick}
            />
          ))}

          {/* Inline Terminal Status while loading */}
          {loading && (
            <div className="font-mono text-xs text-cyan-300/80 flex items-center gap-2 py-1.5 animate-pulse">
              <LoaderCircle size={14} className="animate-spin text-cyan-400" />
              <span>⌁ {stage || "analyzing candidate memory..."}</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Warp/iTerm2 Style Minimal Agent Input Bar */}
        <div className="border-t border-white/[0.08] bg-[#07090e] p-3 select-none">
          <div className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2 focus-within:border-cyan-400/50 transition-colors shadow-inner">
            <JDUploadButton onSelectFile={handleFile} disabled={uploading} />

            <span className="font-mono text-cyan-400 font-semibold text-sm select-none">$</span>

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
              placeholder="Ask about candidate, projects, skills, cloud, AI, or role fit..."
              className="flex-1 bg-transparent outline-none resize-none font-mono text-xs sm:text-sm text-white placeholder:text-white/35 min-h-[22px] max-h-36 leading-6 overflow-y-auto"
              rows={1}
            />

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="h-8 w-8 rounded-lg bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 disabled:opacity-30 hover:bg-cyan-400/30 hover:text-cyan-100 transition-all flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <CornerDownLeft size={14} />
            </button>
          </div>

          {/* JD Upload Progress Bar */}
          {uploading && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10" aria-label="JD analysis progress">
              <div
                className="h-full rounded-full bg-cyan-300 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}

export default memo(TerminalWindow);
