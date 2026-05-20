# Divine Chibueze Nnaji (Navie) — Portfolio

World-class developer portfolio for **Divine Chibueze Nnaji**, Fullstack Software Engineer. Dark navy + electric teal theme, built from CV content.

**Live reference:** [made-by-navie.vercel.app](https://made-by-navie.vercel.app)

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion
- Embla Carousel (mobile projects)
- Inter + Fira Code

## Run locally

```bash
cd divine-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize

| What | Where |
|------|--------|
| All copy, roles, projects, experience | `src/lib/site.ts` |
| Profile photo | Replace `public/profile.svg` or update `About.tsx` |
| Resume PDF | Add `public/resume.pdf` |
| Project GitHub URLs | `src/lib/site.ts` → `projects[].github` |

## Deploy

```bash
npm run build
```

Deploy the `divine-portfolio` folder to Vercel (same as your current site).
