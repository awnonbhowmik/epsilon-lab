# EpsilonLab

EpsilonLab is an interactive differential privacy teaching simulator built with Next.js, TypeScript, and Tailwind CSS. It runs entirely in the browser using a Rust/WASM computation engine — no server or database required.

## Features

- **Laplace & Gaussian mechanisms** with real-time parameter tuning
- **Sequential composition** visualization
- **Demo presets library** — 13 curated configurations across Laplace, Gaussian, and Composition categories
- **Classroom Pack** — generate a single multi-page PDF handout for lectures
- **Embed mode** — iframe-friendly view for LMS integration (Canvas, Blackboard, Moodle)
- **URL share state** — every simulator configuration is encoded in the URL for easy sharing
- **PNG & PDF export** — capture simulation results for slides or handouts

## Routes

| Route | Description |
|---|---|
| `/` | Landing page with simulator |
| `/simulator` | Standalone simulator |
| `/for-instructors` | Instructor onboarding, presets library, checklist, and embed instructions |
| `/classroom-pack` | Generate a bundled PDF classroom handout |
| `/embed` | Embed-friendly simulator (minimal chrome) |
| `/lesson-plan` | Detailed lesson plan with demos and exercises |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## EmailJS Setup (Contact Form)

The contact form uses [EmailJS](https://www.emailjs.com/) to send messages directly from the browser — no backend required.

1. Create a free account at <https://www.emailjs.com/>
2. Copy `.env.local.example` to `.env.local` and fill in the three values:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Dashboard → **Email Services** → select your service → Service ID |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Dashboard → **Email Templates** → select your template → Template ID |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Dashboard → **Account** → **General** tab → **Public Key** section |

> **Note:** The public key was previously called "User ID" in older EmailJS versions.

## For Instructors

See [docs/INSTRUCTORS.md](docs/INSTRUCTORS.md) for detailed guidance on:
- Using demo presets
- Embedding in your LMS
- Generating classroom packs
- Reproducibility with seeds
- Accessibility notes

## Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Lint
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for details on the codebase structure, WASM engine, and state management.