# Technical Documentation for Stoxian

This document provides a technical overview of the Stoxian portfolio dashboard application.

## 1. Project Overview

Stoxian is a dynamic web application built to provide investors with real-time insights into their stock portfolio performance. It fetches live market data, calculates key performance indicators, and presents the information in a clear, user-friendly, and responsive interface.

## 2. Technology Stack

- **Frontend Framework:** Next.js (v14+)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:**
    - **Tables:** `@tanstack/react-table` for a flexible and powerful data grid.
    - **Charts:** `recharts` for data visualization.
- **Backend:** Node.js (via Next.js API Routes)
- **Data Fetching (Client):** Axios
- **Financial Data Source:** `yahoo-finance2` library, which acts as an unofficial API wrapper for Yahoo Finance.
- **Excel Export:** `xlsx` library (SheetJS) for client-side file generation.

## 3. Architecture

The application follows a client-server architecture facilitated by Next.js.

### Frontend

The frontend is built with React components and managed by Next.js App Router.
-   **`/` (Landing Page):** A static page to introduce the app.
-   **`/dashboard` (Dashboard Page):** A client-rendered page (`'use client'`) that fetches and displays portfolio data. It manages application state, handles user interactions (refresh, download), and orchestrates data updates.
-   **Components:** Reusable components for the table, charts, and UI elements are located in `src/components`.

### Backend (API Routes)

The backend logic is encapsulated within Next.js API Routes (`src/app/api`).
-   **`GET /api/portfolio`:** This is the single endpoint responsible for fetching and processing all portfolio data.
    - It reads a static JSON file (`src/data/portfolio.json`) which serves as the base portfolio.
    - It iterates through each stock and uses the `yahoo-finance2` library to fetch the latest market data (CMP, P/E Ratio, etc.).
    - It combines the static data with the live market data.
    - It returns the complete, augmented portfolio data as a JSON response.

This server-side approach prevents exposing sensitive information and bypasses potential CORS issues with the financial data sources.

## 4. Key Features and Implementation

### Dynamic Data Updates

The dashboard polls the backend API every 15 seconds using `setInterval` within a React `useEffect` hook. This ensures the CMP, Present Value, and Gain/Loss figures are kept relatively up-to-date. A "Last Updated" timestamp is displayed to the user.

### Sector Grouping

The portfolio data is processed on the client-side to group stocks by their 'sector'. The `@tanstack/react-table` library's grouping functionality is used to render this directly in the table. Summary calculations for each sector are performed separately and displayed in summary cards.

### Excel Export

The "Download" functionality is implemented entirely on the client side. The `xlsx` library takes the current state of the portfolio data (as JSON), converts it into a worksheet, and generates an `.xlsx` file that the user's browser can download.

### Styling

- **Dark Theme:** The dark theme is enabled by default by setting the background color on the `<html>` element in `globals.css` and ensuring all components use colors that work well on a dark background.
- **Glassmorphism:** The "glass effect" on cards is achieved using CSS `backdrop-filter` for blurring and semi-transparent background colors.
- **Responsiveness:** Tailwind CSS's responsive design prefixes (`sm:`, `md:`, `lg:`, etc.) are used to ensure the layout adapts to various screen sizes. 

---

<a href="https://github.com/MrDanielD326/Stoxian" target="_blank" rel="noopener noreferrer"> Back to README </a>
