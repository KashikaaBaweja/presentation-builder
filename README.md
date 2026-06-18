# Presentation Builder

A web-based presentation builder that lets you create a polished 10-slide deck directly in the browser. Every text field is editable inline, and you can export the full presentation as a high-fidelity PDF.

## Features

- **10 professionally designed slides** — Cover, Agenda, Problem, Solution, How It Works, Features, Testimonials, Pricing, Team, and Call to Action
- **Inline editing** — Click any text to edit directly on the slide
- **Session persistence** — Your edits are saved in the browser (localStorage)
- **Slide navigation** — Sidebar thumbnails, Previous/Next buttons, and dot indicators
- **PDF export** — Pixel-accurate 16:9 widescreen PDF at high resolution (html-to-image + jsPDF)
- **Theme controls** — Accent color picker and optional logo upload

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS 4
- **State:** Zustand with localStorage persistence
- **PDF Export:** html-to-image + jsPDF (client-side; avoids Tailwind v4 oklab issues with html2canvas)
- **Fonts:** Plus Jakarta Sans (headings) + Inter (body) via Google Fonts

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
git clone <repository-url>
cd presentation-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Edit content** — Click any text on a slide to edit it inline
2. **Navigate** — Use the sidebar, Previous/Next buttons, or dot indicators
3. **Customize** — Pick an accent color or upload a logo from the toolbar
4. **Export** — Click "Export to PDF" to download your presentation

## PDF Export Details

- Page size: 1280×720px (16:9 widescreen)
- Render scale: 2× for crisp text (~192 DPI equivalent)
- Export time: Typically under 5 seconds for all 10 slides

## Browser Support

Tested on latest versions of Chrome, Firefox, and Safari. Optimized for viewports 1280px and wider.

## Project Structure

```
src/
├── app/              # Next.js app router
├── components/       # UI components (toolbar, navigation, editor)
├── slides/           # Individual slide components (01–10)
├── store/            # Zustand state management
└── lib/              # Constants and PDF export utility
```

## License

Private — built for Dagar.io
