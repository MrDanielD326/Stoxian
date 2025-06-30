# Stoxian Project: Step-by-Step Guide

## 1. Project Setup & Structure

- **Framework:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Directory Structure:**
  - `src/app/` — Pages, API routes, global layout/styles
  - `src/api/` — API fetchers (e.g., `fetchPortfolioData`)
  - `src/hooks/` — Custom React hooks (e.g., `usePortfolio`)
  - `src/components/` — UI components (dashboard, layout, etc.)
  - `src/lib/` — Utilities (e.g., Excel export)
  - `src/types/` — TypeScript types
  - `src/data/` — Static data (portfolio.json)

## 2. Dependencies Used

- **next**: Core React framework for SSR/SSG
- **react, react-dom**: UI library
- **@tanstack/react-table**: Advanced table rendering and filtering
- **recharts**: Data visualization (charts)
- **axios**: HTTP client for API calls
- **xlsx**: Export portfolio data to Excel
- **yahoo-finance2**: Fetch live market data
- **tailwindcss**: Utility-first CSS framework
- **eslint, typescript, @types/**: Linting and type safety

## 3. Key Coding Decisions & Architecture

- **API Layer:**
  - `/api/portfolio` route fetches static portfolio data and enriches it with live market data from Yahoo Finance.
  - API is always dynamic (`export const dynamic = 'force-dynamic'`) to avoid caching.
  - For demo purposes, a small random fluctuation is added to CMP on each request so the UI visibly updates on refresh.

- **Hooks & Data Fetching:**
  - `usePortfolio` custom hook manages fetching, loading, error, refresh, and summary state.
  - Data is fetched on mount and every 15 seconds; manual refresh is supported.

- **UI Components:**
  - **PortfolioTable**: Sortable, filterable, compact table with custom formatting.
  - **PortfolioCharts**: Pie and bar charts with custom tooltips, glassmorphism, and sector color coding.
  - **PortfolioSummary**: Responsive summary cards for investment, value, and gain/loss.
  - **TableFilters**: Search, sector filter, and gain/loss pill filter.

- **Utilities:**
  - **xlsx.ts**: Exports the current table view to a styled Excel file.

- **Styling:**
  - Tailwind CSS for all styling.
  - Custom `glass-effect` and `no-scrollbar` utilities for modern look.

## 4. Major Errors & How They Were Resolved

- **TypeScript: 'exchange' is not assignable to type 'NSE' | 'BSE'**
  - Fixed by mapping and casting the `exchange` property from JSON to the union type in the API route.

- **Recharts: 'activeIndex' not assignable to Pie**
  - Fixed by using `// @ts-expect-error` above the `<Pie ...>` component to suppress type errors (runtime works as expected).

- **Table/Chart Data Not Updating on Refresh**
  - Ensured the frontend triggers a real API re-fetch and added a randomizer to the API for demo/testing.

- **Scrollbar Not Hiding**
  - Added robust cross-browser CSS for `.no-scrollbar` in `globals.css`.

## 5. Demo/Testing Logic

- **Random CMP Fluctuation:**
  - The API adds a small random change to CMP on each request so the UI visibly updates on refresh. Remove this for production.

## 6. Running & Extending the Project

- **Run locally:**
  ```bash
  npm install
  npm run dev
  # Visit http://localhost:3000
  ```
- **Add new stocks:** Edit `src/data/portfolio.json`.
- **Add new columns/metrics:**
  - Update types in `src/types/portfolio.ts`.
  - Update API enrichment logic and table/chart components.
- **Change styling:** Edit Tailwind classes or add new utilities in `globals.css`.

---

**This guide covers the full lifecycle of the Stoxian dashboard, from setup to error handling and demo logic. For further details, see the code and comments in each file.** 

---

<a href="https://github.com/MrDanielD326/Stoxian" target="_blank" rel="noopener noreferrer"> Back to README </a>
