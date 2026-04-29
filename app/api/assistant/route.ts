import { NextResponse } from "next/server";

// In-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;       // max requests
const WINDOW_MS = 60_000;    // per 1 minute

export async function POST(request: Request) {
  try {
    // --- Rate limiting ---
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
                ?? "unknown";
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    } else if (record.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    } else {
      record.count++;
    }

    // --- Input validation ---
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required." }, { status: 400 });
    }
    if (messages.length > 50) {
      return NextResponse.json({ error: "Too many messages." }, { status: 400 });
    }
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content || lastMessage.content.trim().length === 0) {
      return NextResponse.json({ error: "Empty message." }, { status: 400 });
    }
    if (lastMessage.content.length > 2000) {
      return NextResponse.json({ error: "Message too long (max 2000 chars)." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "WebSwap Assistant",
      },
      body: JSON.stringify({
        model: "baidu/qianfan-ocr-fast:free",
        messages: messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to fetch from OpenRouter" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Assistant API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
