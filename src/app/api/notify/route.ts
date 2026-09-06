import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Resolve credentials from environment variables
    let botToken = process.env.TELEGRAM_BOT_TOKEN;
    let chatId = process.env.TELEGRAM_CHAT_ID;

    // 2. Fallback to site_settings table in Supabase if not in env
    if (!botToken || !chatId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data: settings } = await supabase
            .from("site_settings")
            .select("telegram_bot_token, telegram_chat_id")
            .eq("id", "primary")
            .maybeSingle();

          if (settings) {
            botToken = botToken || settings.telegram_bot_token;
            chatId = chatId || settings.telegram_chat_id;
          }
        } catch (dbErr) {
          console.warn("Could not query telegram settings from database:", dbErr);
        }
      }
    }

    if (!botToken || !chatId) {
      console.warn("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured.");
      return NextResponse.json({
        success: false,
        message: "Telegram credentials not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID."
      });
    }

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Lagos",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const htmlMessage = `<b>🔔 NEW PORTFOLIO INQUIRY!</b>
━━━━━━━━━━━━━━━━━━━
👤 <b>From:</b> ${escapeHtml(name)}
📧 <b>Email:</b> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
🕒 <b>Time:</b> ${escapeHtml(timestamp)}

💬 <b>Message:</b>
${escapeHtml(message)}
━━━━━━━━━━━━━━━━━━━
🚀 <i>Sent via divinethe.dev contact engine</i>`;

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.error("Telegram API Error:", result);
      return NextResponse.json({ error: result.description || "Failed to deliver Telegram notification" }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: "Telegram push notification sent successfully!" });
  } catch (err: any) {
    console.error("Notify Route Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
