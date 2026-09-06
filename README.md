# ⚡ Divine Chibueze Nnaji (Navie) — Engineering Portfolio & Mission Control CMS

[![Next.js](https://img.shields.io/badge/Next.js-15.2_Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Telegram](https://img.shields.io/badge/Telegram-Real--time_Push_Alerts-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://telegram.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://divinethe.dev)

A world-class, cybernetic developer portfolio and headless Content Management System (CMS) engineered with **Next.js 15 (Turbopack)**, **Supabase PostgreSQL**, **PDFKit**, and **Telegram Edge Webhooks**. Built specifically for high-performance personal branding, interactive recruiter engagement, real-time client leads, and complete administrative control.

**🌐 Live Production Deployment:** [divinethe.dev](https://divinethe.dev)  
**👨‍💻 Engineer:** Divine Chibueze Nnaji (Navie) — Fullstack Software Engineer & AI Systems Builder  
**📬 Telegram Bot Alerts:** [@divinethedevbot](https://t.me/divinethedevbot)

---

## 📑 Table of Contents
- [Key Features & Architectural Highlights](#-key-features--architectural-highlights)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Admin Mission Control Suite](#-admin-mission-control-suite)
- [Terminal Shell CLI Commands](#-terminal-shell-cli-commands)
- [Database Schema & Storage Buckets](#-database-schema--storage-buckets)
- [Environment Variables](#-environment-variables)
- [Local Development Setup](#-local-development-setup)
- [Deployment Guide (Vercel + Supabase)](#-deployment-guide-vercel--supabase)
- [Security & Row-Level Security (RLS)](#-security--row-level-security-rls)
- [Author & Connect](#-author--connect)

---

## ⚡ Key Features & Architectural Highlights

### 1. 🤖 Zero-Credits Resilient AI Assistant (`/api/chat`)
- Powered by **Google Gemini Flash API** with an intelligent, self-healing **offline fallback engine**.
- If Gemini quota/credits run out (`429 Resource Exhausted`), the assistant automatically falls back to an internal portfolio knowledge base that accurately answers questions about tech stack, experience, projects, resume downloads, and contact channels. **Zero downtime, zero red errors for visitors.**

### 2. 📄 In-Memory PDF CV Compiler (`/api/generate-pdf`)
- Replaces legacy Python child-process CLI scripts with a native **Node.js PDFKit** compiler.
- Compiles custom, ATS-friendly, professional CV PDFs entirely **in-memory** within Next.js serverless execution limits.
- Automatically pushes the generated binary to Supabase Storage (`portfolio-assets`) and updates live download links sitewide.

### 3. 🔔 Instant Telegram Push Notifications (`/api/notify`)
- When a client or recruiter submits the portfolio contact form:
  - An instant push notification with sound and vibration is dispatched to Divine's personal phone via Telegram (`@divinethedevbot`).
  - Contains sender Name, clickable Email, Timestamp, and full Message.
  - The submission is simultaneously saved to the Supabase `contact_messages` table and forwarded to Formspree.
  - Asynchronous and non-blocking—visitor submission never stalls or fails.

### 4. 📊 Recruiter Telemetry & 7-Day Trend Visualizer
- Records anonymous visitor events (`page_view`, `cv_download`, `contact_attempt`, `command_executed`).
- Live Admin HUD features 4 core KPI conversion metrics (Impressions, CV Download Conversion %, Lead Inquiries %, and AI Assistant Engagement %).
- Features a glowing **7-day activity bar sparkline** visualizer tracking daily traffic patterns.

### 5. 🔍 Google Search Rich Snippets (Schema.org JSON-LD)
- Implements the Schema.org `@graph` multi-entity specification in `layout.tsx` (`Person`, `WebSite`, and `ProfilePage`).
- Optimizes search indexing for Google Knowledge Panels, Bing, and AI search engines (Perplexity, ChatGPT Search) for queries like *"Divine Chibueze Nnaji Software Engineer"*.

### 6. 💻 Cybernetic Terminal Shell & ASCII Retro Mini-Game
- Full interactive UNIX terminal emulator (`TerminalView.tsx`).
- Type `help`, `cat <project>`, `open <project>`, `hack` (Matrix digital rain canvas), `theme <color>`, or `snake` (a fully playable retro ASCII snake game rendered in monospace logs).

---

## 🏛 System Architecture

```mermaid
graph TD
    A[Visitor / Recruiter] -->|HTTPS| B[Next.js 15 Frontend / Vercel Edge]
    B -->|Browse / Interact| C[Interactive Portfolio UI]
    C -->|CLI Commands| D[Interactive Hacker Terminal]
    C -->|Submit Inquiry| E[/api/notify]
    C -->|Ask Question| F[/api/chat]
    C -->|Download CV| G[Supabase Storage CDN]
    
    E -->|Real-time Webhook| H[Telegram Bot API ➔ Phone Notification]
    E -->|Store Message| I[(Supabase PostgreSQL: contact_messages)]
    E -->|Email Backup| J[Formspree]

    F -->|Live Query| K[Google Gemini Flash API]
    F -.->|Quota Exceeded Fallback| L[Smart Local Portfolio Engine]

    M[Admin Mission Control] -->|JWT Auth Session| N[Dashboard Layout / RBAC]
    N -->|Manage Content| I
    N -->|Compile CV| O[/api/generate-pdf]
    O -->|In-Memory PDFKit| G
```

---

## 🛠 Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack, Server Actions, Dynamic Route Handlers) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), CSS Custom Properties runtime theming |
| **Animations** | [Framer Motion](https://www.framer.com/motion/), Canvas Matrix rain, Tactile Audio Web Audio API |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL 15, Row Level Security, Storage Buckets, GoTrue Auth) |
| **AI Integration** | [Google Gemini Flash API](https://ai.google.dev/) + Resilient Zero-Credits Local Fallback |
| **Document Generation** | [PDFKit](https://pdfkit.org/) (In-memory serverless PDF compilation) |
| **Notifications** | [Telegram Bot API](https://core.telegram.org/bots/api) + [Formspree](https://formspree.io/) |
| **Typography** | `Outfit` (Headings & UI) + `Fira Code` (Technical telemetry, code blocks, and monospace shell) |
| **Hosting** | [Vercel](https://vercel.com/) Edge Network |

---

## 🎛 Admin Mission Control Suite

The admin portal (`/admin/dashboard`) provides authenticated, role-based access control (RBAC) to manage every layer of the portfolio:

| Route | Purpose | Key Capabilities |
|---|---|---|
| `/admin/dashboard` | **Mission Control Overview** | Live counts, Database Seed Engine, Security roles, 7-Day Activity Sparkline, KPI conversion cards, Branding Asset Uploaders (Logo, Profile Photos, CV, Social OG Image). |
| `/admin/dashboard/projects` | **Project Manager** | Create, edit, reorder projects, upload gallery images, write detailed case studies (Problem, Approach, Solution, Outcome). |
| `/admin/dashboard/experience` | **Experience Timeline** | Manage work history, roles, dates, company names, technology tags, and key accomplishments. |
| `/admin/dashboard/skills` | **Skill Clusters** | Categorize skills into frontend, backend, DevOps, and AI groups with fluency levels. |
| `/admin/dashboard/education` | **Education & Certs** | Manage academic degrees, certifications, issuing bodies, verification URLs, and credential dates. |
| `/admin/dashboard/services` | **Services Offered** | Define client service offerings with Lucide icons, descriptions, and feature lists. |
| `/admin/dashboard/testimonials` | **Client Testimonials** | Review and publish client endorsements with 5-star ratings and client profile photos. |
| `/admin/dashboard/workflows` | **Workflow Simulator** | Manage interactive n8n-style automation nodes, webhook steps, and execution visualizers. |
| `/admin/dashboard/theme` | **Theme Engine** | Customize sitewide accent colors, dark/light mode background schemes with real-time Color Checker preview. |
| `/admin/dashboard/seo` | **SEO & PDF CV Compiler** | Trigger in-memory PDF CV generation, upload Social OG share cards with preview, and edit dynamic About Me & Hero bios. |
| `/admin/dashboard/messages` | **Inquiry Inbox** | Review all inbound contact submissions with read/unread statuses and direct email links. |

---

## ⌨️ Terminal Shell CLI Commands

Visitors can launch the terminal by clicking the terminal icon or pressing the terminal toggle. Available commands:

| Command | Arguments | Description |
|---|---|---|
| `help` | *none* | Displays the list of available commands and instructions |
| `about` | *none* | Prints Divine's biography, background, and engineering focus |
| `skills` | *none* | Monospace bulleted breakdown of frontend, backend, AI, and DevOps skills |
| `projects` | *none* | Lists all production projects with descriptions and tech stacks |
| `cat` | `<project_slug>` | Reads the full case study of a specific project directly in the terminal |
| `chat` | `<question>` | Interacts with Divine's AI representative (Gemini Flash + Offline fallback) |
| `cv` / `resume` | *none* | Opens the compiled PDF resume in a secure modal viewer or download |
| `theme` | `teal` \| `blue` \| `pink` \| `green` \| `red` \| `orange` | Instantly updates the visual accent theme sitewide |
| `hack` | *none* | Overrides the terminal viewport with an interactive Matrix digital rain effect |
| `snake` | *none* | Launches the retro ASCII snake mini-game with score tracking |
| `open` | `<project_slug>` | Launches the live deployed project inside the built-in browser sandbox |
| `clear` | *none* | Purges the terminal scrollback buffer |

---

## 🗄 Database Schema & Storage Buckets

### Supabase Storage Buckets
The application requires two public storage buckets in Supabase:
1. **`portfolio-assets`**: Stores branding elements (Logo, Profile Avatars, Official compiled CV PDF, Social OG share image).
2. **`portfolio-images`**: Stores project showcase screenshots and case study gallery photos.

### SQL Setup Script
Run this script once in your **Supabase SQL Editor** to initialize the buckets, permissions, and settings table:

```sql
-- 1. Create Public Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('portfolio-assets', 'portfolio-assets', true),
  ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage RLS Policies (Public Read, Admin Write)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

CREATE POLICY "Public Access Assets" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Access Images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can upload to assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Authenticated users can update assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Authenticated users can delete assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated users can upload to images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-images');
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-images');
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-images');

-- 3. Dynamic Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY DEFAULT 'primary',
  logo_url text,
  avatar1_url text,
  avatar2_url text,
  resume_url text,
  seo_title text,
  seo_desc text,
  seo_keywords text,
  seo_og_image text,
  analytics_id text,
  about_bio text,
  sidebar_bio text,
  accent_color text DEFAULT 'rgb(100, 255, 218)',
  dark_bg_color text DEFAULT '#000000',
  light_bg_color text DEFAULT '#f6f8fa',
  accent_presets jsonb,
  telegram_bot_token text,
  telegram_chat_id text,
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read of site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update of site_settings" ON site_settings FOR ALL TO authenticated USING (true);
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# Google Gemini Flash AI (Optional - fallback mode activates automatically if empty)
GEMINI_API_KEY="AIzaSy..."

# Supabase Database & Storage Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."

# Telegram Push Notifications
TELEGRAM_BOT_TOKEN="8830139515:AAGV..."
TELEGRAM_CHAT_ID="5758847362"
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/D33yan/divinethedev.git
   cd divinethedev
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the `.env.local` template above and fill in your credentials.

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build and verify production output:**
   ```bash
   npm run build
   ```

---

## 🚢 Deployment Guide (Vercel + Supabase)

### 1. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Run the provided SQL script in the **SQL Editor**.
3. Create an admin user under **Authentication** ➔ **Users**.
4. In the `profiles` table, ensure your user has `role = 'admin'`.

### 2. Vercel Deployment
1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Under **Project Settings ➔ Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
3. Click **Deploy**. Vercel will automatically build the Next.js 15 Turbopack project.

---

## 🔒 Security & Row-Level Security (RLS)

- **Client-Side Safety**: The browser only holds the Supabase Publishable (Anon) key. It cannot perform destructive database operations or edit arbitrary tables.
- **Server-Side Clearance**: Critical administrative actions (such as generating CV binaries and publishing branding updates) run either via server route handlers with user session bearer tokens or require authenticated Supabase sessions.
- **Secrets Protection**: `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_CHAT_ID` reside strictly on the server and are **never exposed to client browser bundles**.
- **Rate Limiting**: Built-in sliding-window rate limiters prevent API abuse on chat and notification endpoints.

---

## 👨‍💻 Author & Connect

**Divine Chibueze Nnaji (Navie)**  
*Fullstack Software Engineer & AI Systems Builder*

- 🌐 **Portfolio**: [divinethe.dev](https://divinethe.dev)
- 🐙 **GitHub**: [@D33yan](https://github.com/D33yan)
- 💼 **LinkedIn**: [divine-nnaji](https://linkedin.com/in/divine-nnaji-23b771393)
- ✈️ **Telegram**: [@Callmenavi3](https://t.me/Callmenavi3)
- 📧 **Email**: [dnnaji26@gmail.com](mailto:dnnaji26@gmail.com)

---

<p align="center">
  <b>Engineered with precision. Delivered for impact.</b><br/>
  © 2026 Divine Chibueze Nnaji. All rights reserved.
</p>
