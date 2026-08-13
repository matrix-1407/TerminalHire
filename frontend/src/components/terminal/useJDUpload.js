import { useCallback, useState } from "react";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const getExtension = (fileName = "") => {
  const index = fileName.lastIndexOf(".");
  return index >= 0 ? fileName.slice(index).toLowerCase() : "";
};

export default function useJDUpload({ onComplete, onError } = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const analyzeFile = useCallback(async (file) => {
    setError("");

    if (!file) return;

    const extension = getExtension(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      const message = "Please upload a PDF, DOCX, or TXT job description.";
      setError(message);
      onError?.(message);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const message = "The job description must be 5 MB or smaller.";
      setError(message);
      onError?.(message);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setProgress(25);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/jd/analyze", {
        method: "POST",
        body: formData,
      });

      setProgress(75);

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.detail || "JD analysis failed. Please try another file.");
      }

      setProgress(100);
      onComplete?.(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error while analyzing the JD.";
      setError(message);
      onError?.(message);
    } finally {
      window.setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 350);
    }
  }, [onComplete, onError]);

  return {
    uploading,
    progress,
    error,
    analyzeFile,
  };
}
