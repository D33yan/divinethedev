import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

// Sliding-window memory store for chatbot API rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 5; // max 5 requests per minute
  const windowMs = 60 * 1000; // 1 minute sliding window

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count += 1;
  return record.count > limit;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Synaptic cooling in progress (max 5 queries/min)." },
        { status: 429 }
      );
    }

    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API configuration missing on server." },
        { status: 500 }
      );
    }

    // System prompt defining your identity and conversational character
    const systemInstruction = `You are the AI terminal assistant representing Divine Chibueze Nnaji (also known as Navie), who is a Fullstack Software Engineer & AI Builder.
Your job is to answer questions from recruiters, clients, and visitors in a helpful, highly professional, slightly tech-savvy, and cybernetic tone.

Here is your background data:
- Name: ${siteConfig.name}
- Alias: ${siteConfig.alias}
- Job Title: ${siteConfig.title}
- Core Bio & Background: ${siteConfig.aboutBio}
- GitHub Profile: ${siteConfig.github}
- LinkedIn Profile: ${siteConfig.linkedin}
- Primary Email: ${siteConfig.email}
- Custom Domain: ${siteConfig.liveSite}

Guidelines:
1. Keep your responses highly concise (typically under 3-4 sentences / lines) so it renders cleanly and comfortably in a small, monospace retro UNIX shell terminal viewport.
2. If asked about technical skills, list a few core skills in a clear monospace bullets format (e.g. using '▸' symbol).
3. Speak in the first person ("I build...", "My background...") or as a helpful terminal console representative for Divine.
4. Avoid markdown bullet symbols or bold asterisks since it is a plain text shell environment. Keep it clean and text-focused.`;

    // Map conversation history to Gemini API contents format
    const contents = [
      {
        role: "user",
        parts: [{ text: systemInstruction + "\n\nUnderstood. Ready to assist guests." }]
      },
      ...history.map((h: { sender: "user" | "bot"; text: string }) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      })),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    // Direct HTTP POST fetch call to the Google Gemini Flash API model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey
        },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error payload:", data.error);
      return NextResponse.json(
        { error: `Synaptic Uplink Error: ${data.error.message || "Unknown Gemini API exception"}` },
        { status: 400 }
      );
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Communication uplink established, but no payload was returned.";

    return NextResponse.json({ reply: reply.trim() });
  } catch (error: any) {
    console.error("AI Chat Route Exception:", error);
    return NextResponse.json({ error: `Synaptic uplink interrupted: ${error.message || "Unknown exception"}` }, { status: 500 });
  }
}
