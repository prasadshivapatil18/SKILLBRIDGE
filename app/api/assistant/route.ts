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

    const apiKey = "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";

    const systemPrompt = {
      role: "system",
      content: `You are the SkillSwap Official Assistant. SkillSwap is a peer-to-peer skill-bartering platform for students.
      
      Key Features you should know:
      1. Discovery: Users can find mentors and partners. They can view profiles (expertise, interests, credits) and send swap requests.
      2. Swap Requests: Located in /requests. Users can accept or decline invitations. Accepting creates a session.
      3. Dashboard: Shows upcoming sessions, recent requests, and skill vault.
      4. Sessions & Rescheduling: Sessions have date, time, and duration. Users can "Propose Reschedule". The partner must "Accept" or "Reject" the new timing for it to take effect.
      5. Skill Vault: Users manage "Expertise" (what they teach) and "Interests" (what they want to learn).
      6. Credits: A credit-based economy. Users earn credits by teaching and spend them to learn. Standard session is 2 credits.
      7. Instant Meetings: Users can generate a private room ID and share it for an immediate video call.
      
      Keep your responses helpful, concise, and encouraging to students. If they ask about technical issues, mention we use WebRTC for high-quality video calls.`
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SkillSwap Assistant",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        messages: [systemPrompt, ...messages.filter((m: any) => m.role !== "system")],
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
