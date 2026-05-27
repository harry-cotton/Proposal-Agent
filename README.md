# Federal Proposal Agent — Case Study

A working prototype of an agentic system that finds federal contract opportunities on SAM.gov, parses their requirements, and drafts a first-pass proposal response — built by **Harry Cotton** on paternity leave.

Live demo: _(your Vercel URL once deployed)_

## What's in this repo

```
index.html         · the case-study + live working prototype (entry point)
data.js            · mock data the prototype renders
about.jsx          · About / case-study page (light editorial)
working.jsx        · Discovery, Opportunity, and Agent Run tabs (dark dashboard)
app.jsx            · top bar, footer, routing

briefing/          · earlier exploration — pure editorial direction (kept for reference)
console/           · earlier exploration — pure dark/terminal direction (kept for reference)
```

## Running locally

It's plain HTML — open `index.html` in any browser. No build step.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → "Add New Project".
3. Pick this repo. Vercel will detect it as a static site automatically.
4. Click "Deploy". Done.

## Stack

- React 18 (loaded from CDN), Babel standalone for inline JSX
- Fonts: Instrument Serif, IBM Plex Sans/Mono, Space Grotesk, JetBrains Mono (Google Fonts)
- No backend, no build step — pure static HTML/JS

The actual agent (Sonnet 4.6 orchestration, Opus 4.6 drafting, Haiku 4.5 summarization) runs separately in Python; the data shown here is captured from real production runs.

---

Personal project, not a Deloitte product. Not affiliated with the firm's federal practice.
