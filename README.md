# Premium Cybernetic Portfolio Template & CMS Framework

A highly structured, customizable, and general-purpose developer portfolio template built with Next.js 16, Supabase, and dynamic theming variables. Adapted for developers, designers, freelancers, automation engineers, and tech professionals.

Featuring an interactive retro UNIX shell terminal, client-side telemetry trackers, a visual workflow automation simulator, retro ASCII terminal games, and a full-featured admin CMS.

**Live Production Example:** [divinethe.dev](https://divinethe.dev)

---

## ⚡ Architecture & Customization Features

### 1. ⚙️ Centralized Configuration & Section Ordering
All static structures, diagnostic values, and feature gates are managed centrally in [site.ts](file:///c:/Users/DEVINE/Downloads/navie-portfolio-revamp/divinethedev/src/lib/site.ts). 
- **Dynamic Render sequence**: Change the order of sections on your landing page instantly by rearranging strings in `themeConfig.sectionsOrder`.
- **Dynamic Navigation Link generator**: Sidebar links and mobile nav panels automatically parse the `sectionsOrder` array, keeping anchor scrolls in sync and eliminating broken paths.
- **Section Toggle gates**: Enable or disable the Terminal, Services, Testimonials, and Workflow sections instantly via config properties.

### 2. 🎨 Dynamic Theme Engine & "Color Checker" CMS
- **Tailwind Variables bindings**: Core styles in [globals.css](file:///c:/Users/DEVINE/Downloads/navie-portfolio-revamp/divinethedev/src/app/globals.css) are bound to runtime CSS custom properties (`--color-accent`, `--bg-navy-custom`, `--bg-white-custom`).
- **Responsive Theme Configurator** (`/admin/dashboard/theme`):
  - **Accent Selector**: Customizes 5 preset accent colors and sets the active styling color.
  - **Background Pickers**: Swap base background colors for both Dark and Light modes.
  - **Live Color Checker preview**: An interactive mock frame showing project cards and button buttons against your dark/light picks in real-time.
- Changes update sitewide instantly upon saving.

### 3. 📂 Supabase Database CMS Managers
- **Services Manager** (`/admin/dashboard/services`): Add services and assign Lucide icon names.
- **Client Reviews** (`/admin/dashboard/testimonials`): Create and edit client testimonials with rating levels (1-5 stars) and client profiles.
- **Conditional Visibility**: Sections automatically return `null` and hide if they have no entries in your database.
- **Overview Seeder**: Click **"Seed Database"** to instantly reset the portfolio and settings back to original defaults.

### 4. 🔗 n8n Workflow Visualizer
- **SVG Connector animations**: Displays visual automation pipeline flowcharts with animated glowing pulses (`src/components/sections/Workflows.tsx`).
- **Inspection cards**: Select different stages on the canvas to display description notes and active code parameters.
- **Centralized presets**: Edit nodes and simulated webhook logs directly inside `workflowsConfig` in `site.ts`.

### 5. 🐍 Terminal ASCII Snake Game
- Fully playable **retro Snake game** built in TypeScript directly inside the shell terminal.
- Launch by typing `snake` in the CLI. Keeps score tracks and renders frames dynamically inside the logs.

---

## 🛠️ Technology Stack

* **Core**: Next.js 16 (App Router) + TypeScript + React 19
* **CMS Backend**: Supabase (PostgreSQL + RLS policy structures)
* **Styling**: Tailwind CSS v4 + Framer Motion (premium tactile animations) + Lucide Icons
* **Proxy Route**: Google Gemini Flash API Proxy Route (`/api/chat`)
* **Typography**: Outfit (Sans-Serif) + Fira Code (Monospace)

---

## ⌨️ Shell Console CLI Cheat-Sheet

Type these directly inside the interactive hacker terminal to execute commands:

| Command | Sub-arguments | Action / Operator |
|---------|---------------|-------------------|
| `help` | None | Lists all valid command parameters and instructions |
| `chat` | `<your question>` | Query the secure Gemini Flash AI representative |
| `snake` | None | Launch the playable retro ASCII snake mini-game |
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
   Create a `.env.local` file in your root folder and add your credentials:
   ```env
   # Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # Supabase Credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. **Fire up the development environment**:
   ```bash
   npm run dev
   ```

4. **Compile optimized production build**:
   ```bash
   npm run build
   ```
