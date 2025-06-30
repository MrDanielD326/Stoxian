export interface BaseStock {
  name: string;
  ticker: string;
  exchange: "NSE" | "BSE" | string;
  purchasePrice: number;
  quantity: number;
  sector: string;
}

export interface MarketData {
  cmp: number;
  peRatio?: number;
  latestEarnings?: number | string;
}

export interface PortfolioStock extends BaseStock {
  investment: number;
  portfolioPercentage: number;
  marketData: MarketData | null;
  presentValue: number;
  gainLoss: number;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  stocks: PortfolioStock[];
}
