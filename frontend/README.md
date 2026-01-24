# 🧭 Ryley Hynes — Software Engineering Portfolio

A **React 19 + TypeScript** portfolio built with **Vite 7**, **TailwindCSS**, and **SCSS** — designed to showcase professional-grade engineering, reliability, and developer experience.  
Includes animated page transitions, dark mode, and structured sections for projects, skills, and contact.

---

## 🚀 Quick Start

```bash
# 1️⃣ Clone the repository
git clone https://github.com/RyleyHynes/hynes-portfolio-static.git
cd hynes-portfolio-static

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the development server
npm run dev
# Open http://localhost:3000 in your browser

# 4️⃣ Build and preview for production
npm run build
npm run preview
# Optimized static files output to /dist

## ✅ Testing & Coverage

This portfolio ships with Vitest + Testing Library coverage to prove the interaction-heavy pages and API wrappers are production ready:

- **UI tests**: Every page component lives alongside `__tests__` verifying keyboard-accessible modals, carousels, timelines, and data cards.
- **API slice tests**: `portfolioApi.ts` exports helper functions so we can unit test base URL resolution, auth header preparation, and each RTK Query endpoint definition without hitting a backend.
- **Accessibility polyfills**: The Vitest setup file polyfills `IntersectionObserver`, `scrollTo`, and other browser APIs so advanced animations (Framer Motion) can be tested.

### Run commands

```bash
# Run the full suite once (jsdom environment)
npm run test

# Watch mode for local development
npm run test:watch

# Generate coverage with V8/Istanbul instrumentation
npm run test:coverage
# Reports written to coverage/report/index.html
```

### Serve the coverage dashboard

After running `npm run test:coverage`, view the HTML report in your default browser:

```bash
npm run coverage:serve
```

The helper spins up a tiny static server (default port 4174) and opens `coverage/report/index.html` automatically. Override the port with `COVERAGE_PORT=5000 npm run coverage:serve`.

This makes it easy for anyone exploring the repo to validate testing discipline: run the suite, inspect the coverage report, and walk through the per-page test files to see how interactions were captured.
