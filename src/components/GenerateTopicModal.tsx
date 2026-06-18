"use client";

import type { InitialContent } from "@/lib/initialContent";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useCallback, useEffect, useState } from "react";

interface GenerateTopicModalProps {
  open: boolean;
  onClose: () => void;
}

export function GenerateTopicModal({ open, onClose }: GenerateTopicModalProps) {
  const setAllContent = usePresentationStore((s) => s.setAllContent);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [loading, onClose, open]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = topic.trim();
      if (!trimmed) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: trimmed }),
        });

        const data = (await response.json()) as
          | InitialContent
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "Failed to generate presentation"
          );
        }

        setAllContent(data as InitialContent);
        setTopic("");
        onClose();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate presentation"
        );
      } finally {
        setLoading(false);
      }
    },
    [onClose, setAllContent, topic]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-muted-200 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="generate-topic-title"
      >
        <h2
          id="generate-topic-title"
          className="font-heading text-lg font-semibold text-ink"
        >
          Generate from topic
        </h2>
        <p className="mt-1 text-sm text-muted-500">
          Describe your presentation topic and AI will fill all 10 slides.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label
              htmlFor="generate-topic"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Topic
            </label>
            <textarea
              id="generate-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Sustainable urban farming for beginners"
              rows={4}
              required
              disabled={loading}
              className="w-full resize-none rounded-xl border border-muted-200 bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-400 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-muted-200 px-4 py-2 text-sm font-medium text-muted-600 hover:bg-muted-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Generating…" : "Generate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
