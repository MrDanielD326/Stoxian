# Challenges and Solutions

This document outlines the key challenges encountered during the development of the Stoxian portfolio dashboard and the solutions implemented to address them.

## 1. Unofficial Financial Data APIs

### Challenge
A primary requirement was to fetch live stock data (CMP, P/E Ratio) from Yahoo Finance and Google Finance. However, neither of these services provides a stable, public, and officially supported API for this purpose. Relying on unofficial APIs or web scraping is inherently risky, as they can break without warning if the provider changes their website's structure or internal APIs.

### Solution
- **Library Selection:** Instead of building a scraper from scratch, I opted to use the `yahoo-finance2` npm library. This library abstracts the complexities of scraping and provides a clean, promise-based API to query Yahoo Finance. While this still depends on an unofficial source, it is a well-maintained library with an active community, meaning it is more likely to be updated quickly if Yahoo Finance makes breaking changes.
- **Data Consolidation:** The `yahoo-finance2` library was capable of providing all the required data points (CMP, P/E Ratio, Earnings), which eliminated the need to integrate a second, separate source like Google Finance. This simplified the backend logic and reduced the number of external dependencies.
- **Graceful Error Handling:** The backend API route includes `try...catch` blocks to handle potential failures when calling `yahoo-finance2`. If an API call for a specific stock fails, it logs the error on the server and returns a null value for the market data fields, preventing the entire portfolio refresh from failing. The frontend is designed to handle these null values gracefully (e.g., by displaying "N/A").

## 2. Rate Limiting and Performance

### Challenge
Making frequent API calls to an unofficial source for every stock in the portfolio can lead to being rate-limited or IP-banned. Furthermore, fetching data for a large portfolio can be slow, impacting the user experience.

### Solution
- **Server-Side Fetching:** All calls to Yahoo Finance are made from the Next.js backend (API Route). This means all requests originate from the server's IP address, not the individual users' browsers. This centralizes the requests and makes it easier to implement server-level caching in the future.
- **Request Batching:** The backend API route fetches data for all stocks in parallel using `Promise.all`. This is more efficient than fetching data sequentially, reducing the total time required to update the entire portfolio.
- **Client-Side Polling:** The client polls the backend every 15 seconds. This interval is a trade-off between data freshness and API usage. For a production system, this would be replaced by a more robust solution.
- **Future Improvement (Caching):** A proper caching layer (e.g., using Redis or Next.js's built-in data cache) could be added to the backend. The API could cache results from Yahoo Finance for a short period (e.g., 60 seconds) to serve multiple users or frequent refreshes from the same user without hitting the external API every single time.

## 3. Data Consistency and Transformation

### Challenge
The data received from the API (or scraper) is often in a raw format that doesn't match the application's data model. It can also be inconsistent (e.g., a P/E ratio might be missing for a specific stock).

### Solution
- **TypeScript Models:** I defined strict TypeScript types for the portfolio and stock data (`src/types/portfolio.ts`). This ensures type safety and provides clear documentation for the data structures used throughout the application.
- **Data Transformation Layer:** The backend API route is responsible for transforming the raw data from `yahoo-finance2` into the structure defined by the TypeScript types. It handles missing data by mapping `undefined` or `null` responses to a consistent format that the frontend can easily interpret.
- **Client-Side Calculations:** Calculations that depend on a combination of static and live data (e.g., Present Value, Gain/Loss) are performed on the client side. This keeps the backend focused on data fetching and transformation, while the client handles the final presentation logic. 

---

<a href="https://github.com/MrDanielD326/Stoxian" target="_blank" rel="noopener noreferrer"> Back to README </a>
