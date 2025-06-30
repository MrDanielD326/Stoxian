"use client";

import PortfolioTable from "@/components/PortfolioTable";
import { exportToExcel } from "@/lib/xlsx";
import PortfolioCharts from "@/components/PortfolioCharts";
import PortfolioSummary from "@/components/PortfolioSummary";
import { usePortfolio } from "@/hooks/usePortfolio";

export default function DashboardPage() {
  const {
    portfolio,
    isLoading,
    error,
    lastUpdated,
    refresh,
    summary
  } = usePortfolio();

  const handleDownload = () => {
    if (portfolio.length > 0) {
      exportToExcel(portfolio);
    } else {
      alert("No data available to download.");
    }
  };

  if (isLoading && !portfolio.length) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl"> Loading Portfolio... </p>
          <p className="text-sm text-gray-400">
            {" "}Fetching real-time data, please wait.{" "}
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center p-8 glass-effect">
          <h2 className="text-xl text-red-500">An Error Occurred</h2>
          <p>
            {" "}{error}{" "}
          </p>
          <button
            onClick={refresh}
            className="mt-4 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stoxian</h1>
          {lastUpdated &&
            <p className="text-xs text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 w-full sm:w-auto"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={handleDownload}
            className="rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600 w-full sm:w-auto disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={portfolio.length === 0}
          >
            Download
          </button>
        </div>
      </div>

      <PortfolioSummary
        totalInvestment={summary.totalInvestment}
        totalPresentValue={summary.totalPresentValue}
        totalGainLoss={summary.totalGainLoss}
      />
      <PortfolioCharts data={portfolio} />
      <PortfolioTable data={portfolio} />
    </main>
  );
}
