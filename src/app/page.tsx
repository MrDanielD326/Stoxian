import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
          Stoxian
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Welcome to your dynamic portfolio dashboard. Track your investments with real-time data and gain insights to make informed decisions.
        </p>
        <div className="mt-10">
          <Link
            href="/dashboard"
            className="rounded-md bg-indigo-500 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Go to Dashboard
          </Link>
        </div>
        <div className="mt-12 p-4 glass-effect">
          <h2 className="text-sm font-semibold text-amber-400"> Disclaimer </h2>
          <p className="mt-2 text-xs text-gray-400">
            Stoxian relies on data from unofficial public sources. The information provided is for educational and informational purposes only and should not be considered financial advice. Data may be delayed or inaccurate. Always consult with a qualified financial advisor before making any investment decisions.
          </p>
        </div>
      </div>
    </main>
  );
}
