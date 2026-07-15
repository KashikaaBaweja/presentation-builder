# Presentation Builder

A full-stack web application for creating, editing, and exporting professional slide decks in the browser. Built for real-world pitch decks, client presentations, and meeting-ready PDFs — without opening PowerPoint or Keynote.

**Live demo:** [https://presentation-builder-self.vercel.app](https://presentation-builder-self.vercel.app)

**Repository:** [https://github.com/KashikaaBaweja/presentation-builder](https://github.com/KashikaaBaweja/presentation-builder)

---

## What it does

Presentation Builder lets authenticated users create multi-slide decks with inline editing, customizable themes, AI-assisted content generation, and one-click PDF export. Decks are saved to the cloud per user, with an admin console for managing users and presentations.

**Typical use cases:**

- Founders preparing investor or sales pitch decks
- Students and professionals building presentation assignments quickly
- Teams drafting slide content with AI, then refining branding and layout before export

---

## Main features

### Editor & slides

- **10 themed template slides** — Cover, Agenda, Problem, Solution, How It Works, Features, Testimonials, Pricing, Team, Call to Action
- **Custom slide type** — Three flexible layouts with editable bullets and body copy
- **Inline editing** — Click any text on a slide to edit in place
- **Slide management** — Add slides (templates or custom), remove slides, drag-and-drop reorder, up/down arrow controls
- **Layout picker** — Alternate layouts for Cover, Solution, Features, Pricing, and Custom slides
- **Typography controls** — Deck-level font family and text size (S / M / L)
- **Theme presets** — Classic, Warm Earth, Cool Slate, Sage, Midnight
- **Slide accent color** — Per-deck accent that applies to slides only (app UI stays fixed indigo)
- **Logo upload** — Optional logo on cover or all slides, auto-downscaled for fast PDF export

### AI & assistants

- **Generate from topic** — Gemini-powered API builds a full 10-slide deck from a short prompt
- **21st Agents assistant** — Chat interface at `/agent` for brainstorming structure, copy, and slide ideas (requires 21st API key + agent deploy)

### Auth & persistence

- Email/password signup and login
- **Google OAuth** via Supabase Auth
- Cloud save/load of decks per user
- Deck library at `/decks` with open, create, and manage flows

### Export

- **PDF export** — Client-side capture via `html-to-image` + `jsPDF`
- Pinned 16:9 dimensions (1280×720), JPEG encoding, logo downscaling
- Automatic quality fallback if output exceeds 5 MB

### Admin

- Admin dashboard at `/admin` — stats, recent users, recent presentations
- User and presentation management pages
- Role-based access via `profiles.role = 'admin'`

### Security

- Safe OAuth redirect validation
- Rate limiting on AI generation
- Security headers (CSP-related, frame denial, HSTS in production)
- Row Level Security on Supabase tables

---

## Tech stack

| Layer | Technology |
|--------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **State** | [Zustand](https://zustand.docs.pmnd.rs/) |
| **Auth & database** | [Supabase](https://supabase.com/) (Auth, PostgreSQL, RLS) |
| **AI generation** | [Google Gemini API](https://ai.google.dev/) (`@google/genai`) |
| **Agents chat** | [21st Agents SDK](https://21st.dev/agents) (`@21st-sdk/*`, `@ai-sdk/react`, `ai`) |
| **PDF export** | [html-to-image](https://github.com/niklasvh/html-to-image), [jsPDF](https://github.com/parallax/jsPDF) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Fonts** | Plus Jakarta Sans (headings), Inter (body) via Google Fonts |

---

## Project structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard, users, presentations
│   ├── agent/           # 21st Agents chat UI
│   ├── api/
│   │   ├── generate/    # Gemini deck generation
│   │   └── an-token/    # 21st Agents token exchange
│   ├── auth/            # OAuth callback, logout
│   ├── decks/           # User deck library
│   ├── editor/          # Main presentation editor
│   ├── login/ & signup/
│   └── page.tsx         # Root redirect
├── components/          # Toolbar, sidebar, modals, auth UI
├── slides/              # Slide components (01–10 + custom)
├── store/               # Zustand store, types, templates
├── lib/                 # PDF export, themes, auth, decks, admin
└── hooks/

agents/
└── my-agent/            # 21st Agents definition (deploy with CLI)

supabase/
├── decks.sql            # Decks table + RLS
└── profiles.sql         # Profiles, admin role, triggers
```

---

## Getting started

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com/) project
- (Optional) [Gemini API key](https://aistudio.google.com/apikey) for AI generation
- (Optional) [21st Agents API key](https://21st.dev/agents/api-keys) for `/agent` chat

### 1. Clone and install

```bash
git clone https://github.com/KashikaaBaweja/presentation-builder.git
cd presentation-builder
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/publishable key |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Site URL for OAuth redirects, e.g. `https://presentation-builder-self.vercel.app` |
| `GEMINI_API_KEY` | No | Enables “Generate from topic” in the editor |
| `API_KEY_21ST` | No | Enables `/agent` chat and CLI deploy |

### 3. Supabase setup

Run these SQL scripts in the Supabase SQL Editor (in order):

1. `supabase/decks.sql` — decks table and user RLS policies
2. `supabase/profiles.sql` — profiles, admin role, signup trigger

**Google OAuth (optional):**

1. Configure Google OAuth in [Google Cloud Console](https://console.cloud.google.com/)
2. In Supabase → Authentication → Providers → enable Google
3. Set **Site URL** and **Redirect URLs** to include `{SITE_URL}/auth/callback`

**Make yourself admin (optional):**

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign up, create a deck, and open the editor.

### 5. 21st Agents (optional)

If using the AI assistant at `/agent`:

```bash
# Add API_KEY_21ST to .env.local first
npx @21st-sdk/cli login
npx @21st-sdk/cli deploy
```

Then visit [http://localhost:3000/agent](http://localhost:3000/agent).

### 6. Production build

```bash
npm run build
npm start
```

---

## Usage guide

### Create and edit a deck

1. Sign up or log in (email or Google)
2. Open **My Decks** and create or open a presentation
3. Click text on any slide to edit inline
4. Use the toolbar to change theme, font, size, layout, and slide accent
5. Use **Add slide** or the sidebar footer to insert template or custom slides
6. Drag the six-dot grip or use ▲▼ to reorder slides
7. Click **Save** to persist to Supabase
8. Click **Export PDF** to download the deck

### Generate from topic

1. In the editor, click **Generate from topic**
2. Enter a short description (e.g. “SaaS startup pitch for a fitness app”)
3. The AI replaces deck content with a full 10-slide draft
4. Edit, retheme, and export as usual

### Admin console

Admins see an **Admin** link in the header. The console includes:

- Dashboard with user/deck counts and recent activity
- User list with deck counts
- Presentation list across all users (read-only view)

---

## PDF export details

- **Slide size:** 1280×720 px (16:9)
- **Format:** JPEG pages embedded in PDF (optimized for file size)
- **Typical output:** ~1–3 MB for a 10-slide deck with logo
- **Fallback:** Re-encodes at lower scale if output exceeds 5 MB

Export runs entirely in the browser — no server-side rendering required.

---

## Deployment (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com/)
2. Add all environment variables from `.env.example`
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain
4. In Supabase, add production redirect URLs for OAuth
5. Deploy

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## Browser support

Tested on latest Chrome, Firefox, and Safari. Best experience on desktop viewports 1280px and wider.

---

## Troubleshooting

### Google sign-in: "provider is not enabled"

1. Supabase → **Authentication → Providers → Google** → enable and add Client ID/Secret
2. Google Cloud → OAuth client → redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. Supabase → **URL Configuration** → add `{SITE_URL}/auth/callback` to Redirect URLs
4. Set `NEXT_PUBLIC_SITE_URL` on Vercel and redeploy

### Email signup: "Check your email to confirm"

Supabase requires email confirmation by default. Click the link in your inbox, or disable **Confirm email** under Authentication → Providers → Email for local testing.

### `npm install` ERESOLVE on @21st-sdk/nextjs

Use `@ai-sdk/react@^2.0.0` and `ai@^5.0.0` (see `package.json`). Run `npm install` again.

---

## License

Private project — built by [Kashika Baweja](https://github.com/KashikaaBaweja).
