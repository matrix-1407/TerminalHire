import { useEffect, useRef, useState } from "react";

const desktopItems = [
  {
    label: "Resume",
    icon: "📄",
    href: "#",
  },
  {
    label: "Portfolio",
    icon: "🌐",
    href: "https://mrudul.dev",
  },
  {
    label: "GitHub",
    icon: "💻",
    href: "https://github.com/matrix-1407",
  },
  {
    label: "LinkedIn",
    icon: "🔗",
    href: "#",
  },
];

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello. I’m TerminalHire, Mrudul’s AI representative. Ask about projects, skills, cloud, AI, networking, or role fit.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const history = [...messages, userMessage];

    setMessages(history);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const response = await fetch("http://127.0.0.1:8000/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage.content,
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
          role: "assistant",
          content: fullText,
        };
        return updated;
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_35%)] pointer-events-none" />

      {/* Top bar */}
      <div className="h-12 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-sm text-white/70 ml-2">TerminalHire • Recruiter Mode</span>
        </div>
        <div className="text-xs text-white/50">Ask the candidate, not just the resume</div>
      </div>

      {/* Desktop icons */}
      <div className="absolute left-6 top-20 hidden md:flex flex-col gap-5">
        {desktopItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="w-20 flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center text-2xl group-hover:bg-white/15 transition">
              {item.icon}
            </div>
            <span className="text-xs text-white/80 text-center">{item.label}</span>
          </a>
        ))}
      </div>

      {/* Terminal window */}
      <div className="h-[calc(100vh-3rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-5xl h-[92vh] md:h-[84vh] rounded-3xl border border-white/10 bg-white/6 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Terminal header */}
          <div className="h-14 border-b border-white/10 flex items-center justify-between px-5 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-sm text-white/70 ml-2">terminalhire --recruiter-mode</span>
            </div>
            <div className="text-xs text-cyan-300/80">LIVE</div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 font-mono text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-cyan-300">
                  {msg.role === "user" ? "> recruiter" : "> terminalhire"}
                </div>
                <div className="whitespace-pre-wrap leading-7 text-white/90">
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-cyan-300 text-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                Analyzing candidate profile...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-4 bg-black/20">
            <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about projects, skills, cloud, AI, networking, or role fit..."
                className="flex-1 bg-transparent outline-none resize-none text-white placeholder:text-white/40 min-h-[24px] max-h-40 font-mono text-sm"
                rows={1}
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-semibold disabled:opacity-40 hover:bg-cyan-300 transition"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>

            <div className="mt-2 text-xs text-white/40 px-1 flex items-center justify-between">
              <span>Press Enter to send </span>
              <span>Groq • Llama 3.3 70B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}