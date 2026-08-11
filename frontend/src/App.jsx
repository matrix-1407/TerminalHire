import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: [],
      }),
    });

    const data = await res.json();
    setResponse(data.response);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">TerminalHire</h1>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-xl p-4"
          placeholder="Ask about the candidate..."
        />

        <button
          onClick={send}
          disabled={loading}
          className="px-4 py-2 bg-white text-black rounded-lg font-medium"
        >
          {loading ? "Thinking..." : "Send"}
        </button>

        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 whitespace-pre-wrap">
          {response}
        </div>
      </div>
    </div>
  );
}