# Divine Chibueze Nnaji (Navie) — Premium Cybernetic Portfolio & AI Chatbot

A world-class, premium developer portfolio website for **Divine Chibueze Nnaji**, Fullstack Software Engineer & AI Builder. Built with a futuristic cyber-tactile design system, featuring custom web sensory integrations, offline-edge machine learning predictions, automatic workflow hooks, and an interactive Gemini-powered serverless shell terminal!

**Live Production Domain:** [divinethe.dev](https://divinethe.dev)

---

## ⚡ Engineering Architecture & Premium Features

### 1. 🤖 UNIX Terminal AI Chatbot Integration
* **Secure Serverless AI Proxy Gateway** (`/api/chat`): Routes visitor queries to Google's official `gemini-flash-latest` model using secure server-side environment variables, protecting credentials from leaking into client-side JS bundles.
* **Contextual System Prompt**: Synthesizes a high-fidelity persona prompt using your central portfolio configuration (`siteConfig`), instructing the AI to respond concisely and accurately as your virtual representative.
* **Interactive Chat Memory**: Preserves session state so recruiters and guests can hold continuous, context-aware conversations.
* **Synaptic Shell Loader & Tickers**: Animates immediate shell updates (`Establishing secure synaptic AI uplink... thinking...`) that seamlessly resolve into typewriter replies upon API compilation.
* **Global 'TALK_TO_AI' CTA Trigger**: Pulses a floating CTA pill right above the diagnostics HUD from anywhere on the landing page. Clicking it smoothly scrolls to the terminal, populates the command prefix (`chat `), and focuses the cursor.

### 2. 🎴 Clickable Project Cards (Tactile Triggers)
* **Tactile Click Zones**: Cards act as interactive touch targets that launch case studies on both single-click and double-click events, supported by custom micro-animations.
* **Event Propagation Guards**: Halts bubble events on nested link triggers (like GitHub, live demo, and case study links), keeping independent redirects working perfectly without trigger clashing.

### 3. 📱 Swipe-Gesture Mockup Screenshot Carousels
* **Smartphone Device Mockup**: Renders mobile application screens (e.g. **Rebid**) inside a glossy phone container complete with an organic bezel shadow and dynamic island notch.
* **Web Browser Mockup**: Presents web application screenshots inside a Mac-style browser dashboard tab with traffic-light action controls and address bar chrome.
* **Framer Motion Touch Gestures**: Supports fluid drag-to-swipe transitions (drag right for next screen, drag left for previous screen) backed by elegant crossfade scales.

### 4. 📄 ATS-Optimized PDF CV Compiler
* **Programmatic PDF CV Generator** (`generate_cv_pdf.py`): Custom compiler using `reportlab` to design a pixel-perfect, single-page ATS-optimized resume with exact margins, heading highlights, tabular column mappings, and clickable email/social links.
* **Unified CV Viewer**: Hosts an in-app interactive native CV viewer dashboard mapping chronological timelines and technical skill pills, with single-click official PDF downloads.

### 5. 🌐 Web-Sensory Event Bridges & Viewport Throttling
* **Dynamic Highlight Tilt**: Hovering skill badges dispatches active events (`highlight-skill`) that tilt the camera viewport of your WebGL/canvas 3D globe magnetically towards corresponding coordinates.
* **GPU Viewport Optimization**: Hooks an `IntersectionObserver` on the 3D Canvas element. If the globe scrolls out of active viewport boundaries, it suspends all render loops to free up **100% of GPU/CPU cycles**, protecting mobile battery life.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router / Server Components) + TypeScript + React 19
* **Styling**: Tailwind CSS v4 + Framer Motion (premium micro-animations) + Lucide Icons
* **Core API Integration**: Direct HTTPS standard fetch calls to Google Gemini API (zero-dependency backend route)
* **Sensory Framework**: Custom browser CustomEvents + canvas WebGL coordinates mapping
* **Typography**: Outfit + Fira Code (Futuristic Monospace)

---

## ⌨️ Shell Console CLI Cheat-Sheet

Type these directly inside the interactive hacker terminal to manipulate the page environment:

| Command | Sub-arguments | Action / Operator |
|---------|---------------|-------------------|
| `help` | None | Lists all valid command parameters and instructions |
| `chat` | `<your question>` | Query the secure Gemini Flash AI representative |
| `ls` | `projects` / None | Directories inspection (interactive list of files) |
| `cat` | `<file_id>.md` | Display a project case study directly in monospace CLI logs |
| `theme` | `pink` / `blue` / `red` / `orange` / `teal` / `green` | Swap global visuals and accent properties instantly |
| `open` | `<project_id>` | Launch the interactive deployed app inside the browser sandbox |
| `resume` | `cv` / None | Initiate secure tunnel download for your ATS-optimized PDF resume |
| `hack` | None | Trigger a beautiful 60fps Matrix digital rain canvas glitched ripple override |
| `gui` | None | Smoothly switch terminal viewport back to the visual slider cards |
| `clear` | None | Purges CLI shell screen output buffer |

---

## 🚀 Getting Started Locally

1. **Clone & install dependencies**:
   ```bash
   git clone https://github.com/D33yan/divinethedev.git
   cd divinethedev
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file in your root folder and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Fire up the development environment**:
   ```bash
   npm run dev
   ```

4. **Verify optimized production build**:
   ```bash
   npm run build
   ```

---

## 📁 Project Directory Mapping

```bash
divinethedev/
├── public/                 # Static assets (ATS PDF, case study screenshot suites)
├── src/
│   ├── app/                # Next.js App Router root layouts, sitemaps, sitemaps configurations
│   │   ├── api/chat/       # Serverless AI route handler (Gemini Flash gateway)
│   │   ├── globals.css     # CSS root custom theme tokens and light mode overrides
│   │   └── page.tsx        # Pre-rendered landing page setup with dynamic client loads
│   ├── components/
│   │   ├── effects/        # Custom cursors, entry loaders, matrix rains, scroll tracks
│   │   ├── layout/         # Sleek sidebar sheets and mobile nav drawer overlay panels
│   │   ├── sections/       # Hero, About profile swappers, native CV dashboards, Projects
│   │   └── ui/             # 3D interactive WebGL globes, TelemetryHUD selectors, Magnetics
│   ├── hooks/              # Section visibility tracking hooks
│   └── lib/                # Static portfolio content database configurations (siteConfig)
```
