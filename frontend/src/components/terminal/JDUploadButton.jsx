import { Paperclip, Plus } from "lucide-react";

export default function JDUploadButton({ onSelectFile, disabled = false }) {
  return (
    <label className="group relative inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100 focus-within:outline focus-within:outline-2 focus-within:outline-cyan-300/70 focus-within:outline-offset-2">
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelectFile?.(file);
          event.target.value = "";
        }}
        aria-label="Upload job description file"
      />
      <Plus className="absolute h-3.5 w-3.5 translate-x-2.5 -translate-y-2.5 text-cyan-200 transition-transform group-hover:scale-110" />
      <Paperclip className="h-5 w-5" />
      <span className="sr-only">Upload JD for suitability analysis</span>
    </label>
  );
}
