import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import type { BaseStock, MarketData } from '@/types/portfolio';
import portfolioData from '@/data/portfolio.json';

// Disable caching for this route
export const dynamic = 'force-dynamic';

async function getMarketData(ticker: string): Promise<MarketData | null> {
  try {
    const quote = await yahooFinance.quote(ticker, {
      fields: ['regularMarketPrice', 'trailingPE', 'epsCurrentYear'],
    });

    if (!quote || !quote.regularMarketPrice) {
      console.warn(`No data found for ticker: ${ticker}`);
      return null;
    }

    return {
      cmp: quote.regularMarketPrice,
      peRatio: quote.trailingPE,
      latestEarnings: quote.epsCurrentYear,
    };
  } catch (error) {
    console.error(`Failed to fetch data for ${ticker}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    const basePortfolio: BaseStock[] = portfolioData;

    const enrichedPortfolio = await Promise.all(
      basePortfolio.map(async (stock) => {
        const marketData = await getMarketData(stock.ticker);
        if (marketData && typeof marketData.cmp === 'number') {
          marketData.cmp = marketData.cmp * (1 + (Math.random() - 0.5) * 0.02); // +/- 1%
        }
        return {
          ...stock, marketData
        };
      })
    );

    return NextResponse.json(enrichedPortfolio);
  } catch (error) {
    console.error('Failed to build portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve portfolio data.' },
      { status: 500 }
    );
  }
};
