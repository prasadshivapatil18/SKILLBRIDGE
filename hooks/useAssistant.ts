"use client";

import { useState, useRef, useCallback } from "react";

export type Role = "user" | "assistant" | "system";

export type Message = {
  role: Role;
  content: string;
};

const SYSTEM_PROMPT: Message = {
  role: "system",
  content:
    "You are a helpful AI assistant for WebSwap, a video calling web app built with Next.js and WebRTC. Help users with using the app, troubleshooting video/audio/connection issues, and general questions. Keep answers concise and friendly.",
};

export function useAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fullHistory includes the system prompt and is used for API calls
  const fullHistory = useRef<Message[]>([SYSTEM_PROMPT]);

  const sendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: "user", content: userInput };

    // Update state and ref
    setMessages((prev) => [...prev, userMessage]);
    fullHistory.current = [...fullHistory.current, userMessage];
    
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: fullHistory.current }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from assistant");
      }

      const assistantMessage: Message = { role: "assistant", content: data.reply };

      // Update state and ref with assistant reply
      setMessages((prev) => [...prev, assistantMessage]);
      fullHistory.current = [...fullHistory.current, assistantMessage];
    } catch (err: any) {
      console.error("useAssistant Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    fullHistory.current = [SYSTEM_PROMPT];
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
