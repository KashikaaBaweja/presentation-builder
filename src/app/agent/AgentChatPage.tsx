"use client";

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs";
import "@21st-sdk/react/styles.css";
import { useChat } from "@ai-sdk/react";
import type { Chat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import Link from "next/link";
import theme from "./theme.json";

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "/api/an-token",
});

export function AgentChatPage() {
  const { messages, sendMessage, status, stop, error } = useChat({
    chat: chat as Chat<UIMessage>,
  });

  return (
    <main className="flex h-screen flex-col bg-muted-50">
      <header className="flex shrink-0 items-center justify-between border-b border-muted-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-muted-900">Presentation Assistant</p>
          <p className="text-xs text-muted-500">Powered by 21st Agents</p>
        </div>
        <Link
          href="/decks"
          className="text-xs font-medium text-brand hover:underline"
        >
          Back to decks
        </Link>
      </header>
      <div className="min-h-0 flex-1">
        <AgentChat
          messages={messages}
          onSend={(msg) => sendMessage({ text: msg.content })}
          status={status}
          onStop={stop}
          error={error ?? undefined}
          theme={theme}
          colorMode="light"
        />
      </div>
    </main>
  );
}
