import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

// Sliding-window memory store for chatbot API rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 10; // max 10 requests per minute
  const windowMs = 60 * 1000;

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

/**
 * Intelligent Zero-Credits Fallback Responder
 * Gracefully provides instant answers about Divine's portfolio when Gemini AI credits/quota are exhausted.
 */
function getLocalPortfolioResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // 1. Skills / Stack
  if (
    q.includes("skill") ||
    q.includes("stack") ||
    q.includes("tech") ||
    q.includes("language") ||
    q.includes("framework") ||
    q.includes("frontend") ||
    q.includes("backend") ||
    q.includes("react") ||
    q.includes("python")
  ) {
    return `Divine's Core Technical Arsenal:
▸ Frontend: Next.js 15, React, React Native (Expo), TypeScript, Tailwind CSS
▸ Backend: Node.js, Express, Python, Supabase (PostgreSQL, RLS)
▸ AI & Automation: Gemini API, LangChain, n8n workflows, CRM automation
▸ DevOps & Tools: Git, Docker, Vercel, Supabase Storage & Edge Functions`;
  }

  // 2. Contact / Hiring / Availability
  if (
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("call") ||
    q.includes("phone") ||
    q.includes("telegram") ||
    q.includes("available") ||
    q.includes("rate") ||
    q.includes("job")
  ) {
    return `Divine is open for freelance contracts and high-impact engineering roles.
▸ Email: ${siteConfig.email}
▸ Phone: +234 810 689 0380
▸ Telegram: @Callmenavi3
▸ GitHub: github.com/D33yan
▸ Or leave a message in the Contact section below for an immediate response!`;
  }

  // 3. Experience / Background / Bio
  if (
    q.includes("experience") ||
    q.includes("background") ||
    q.includes("who are you") ||
    q.includes("about") ||
    q.includes("bio") ||
    q.includes("years") ||
    q.includes("career")
  ) {
    return `Divine Chibueze Nnaji (Navie) is a Fullstack Software Engineer & AI Builder.
He designs and engineers high-performance web applications, mobile experiences, and automated AI workflows.
He specializes in responsive frontend architectures, secure backend data layers, and production-grade software delivery.`;
  }

  // 4. Projects / Work / Portfolio
  if (
    q.includes("project") ||
    q.includes("work") ||
    q.includes("portfolio") ||
    q.includes("app") ||
    q.includes("built") ||
    q.includes("case study")
  ) {
    return `Divine has engineered multiple production projects:
▸ Fullstack AI Applications & Multi-Agent Automations
▸ FitTrack Health PWA (Offline-first mobile health suite)
▸ Reactive Real-time Analytics & CRM Systems
Explore the 'Projects' section below for live demos, architecture writeups, and GitHub source links!`;
  }

  // 5. Resume / CV
  if (
    q.includes("resume") ||
    q.includes("cv") ||
    q.includes("pdf") ||
    q.includes("download")
  ) {
    return `Divine's official CV is generated dynamically with our in-memory PDF compiler.
You can view and download it right from the top navigation bar or the resume viewer on this page.`;
  }

  // 6. Education / Certifications
  if (
    q.includes("education") ||
    q.includes("degree") ||
    q.includes("school") ||
    q.includes("university") ||
    q.includes("certificate") ||
    q.includes("cert")
  ) {
    return `Divine holds a rigorous background in Computer Engineering and Software Development, supplemented with advanced certifications in Fullstack Engineering, Cloud Databases, and AI System Architecture.`;
  }

  // 7. General Greetings / Default
  return `Greetings! I am Divine's AI Terminal Assistant.
I can tell you about his:
▸ Technical skills & tech stack
▸ Featured projects & architecture
▸ Work experience & background
▸ Direct contact info & hiring availability
What would you like to explore?`;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Synaptic cooling in progress (max 10 queries/min)." },
        { status: 429 }
      );
    }

    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message string required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is not configured or empty, seamlessly serve from local portfolio knowledge base
    if (!apiKey) {
      const fallbackReply = getLocalPortfolioResponse(message);
      return NextResponse.json({ reply: fallbackReply });
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
1. Keep your responses highly concise (under 3-4 sentences / lines) so it renders cleanly and comfortably in a small, monospace retro UNIX shell terminal viewport.
2. If asked about technical skills, list a few core skills in a clear monospace bullets format (e.g. using '▸' symbol).
3. Speak in the first person ("I build...", "My background...") or as a helpful terminal console representative for Divine.
4. Avoid markdown formatting like bold asterisks (**) or raw markdown tables since it is a plain text shell environment. Keep it clean and text-focused.`;

    // Map conversation history to Gemini API contents format
    const contents = [
      {
        role: "user",
        parts: [{ text: systemInstruction + "\n\nUnderstood. Ready to assist guests." }]
      },
      ...(Array.isArray(history) ? history : []).map((h: { sender: "user" | "bot"; text: string }) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      })),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    try {
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

      // If Gemini quota is exhausted, rate limited, or throws billing errors, fall back seamlessly
      if (data.error || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.warn("Gemini API quota/error intercepted; serving smart portfolio fallback:", data.error?.message);
        const fallbackReply = getLocalPortfolioResponse(message);
        return NextResponse.json({ reply: fallbackReply });
      }

      const reply = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ reply: reply.trim() });
    } catch (apiErr) {
      console.warn("Gemini network error intercepted; serving smart portfolio fallback:", apiErr);
      const fallbackReply = getLocalPortfolioResponse(message);
      return NextResponse.json({ reply: fallbackReply });
    }
  } catch (error: any) {
    console.error("AI Chat Route Exception:", error);
    return NextResponse.json({ 
      reply: "Greetings! System online. Feel free to ask about Divine's technical skills, experience, projects, or contact information." 
    });
  }
}
