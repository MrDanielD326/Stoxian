import axios from 'axios';
import type { PortfolioStock, BaseStock } from '@/types/portfolio';

const processData = (data: BaseStock[]): PortfolioStock[] => {
  if (!data || data.length === 0) {
    return [];
  }
  const portfolioWithInvestment = data.map(stock => ({
    ...stock,
    investment: stock.purchasePrice * stock.quantity,
    marketData: (stock as BaseStock & { marketData?: import('@/types/portfolio').MarketData }).marketData ?? null
  }));
  const totalInvestment = portfolioWithInvestment.reduce((acc, stock) => acc + stock.investment, 0);
  return portfolioWithInvestment.map((stock) => {
    const presentValue = stock.marketData ? stock.marketData.cmp * stock.quantity : 0;
    const gainLoss = presentValue - stock.investment;
    const portfolioPercentage = totalInvestment > 0 ? (stock.investment / totalInvestment) * 100 : 0;
    return {
      ...stock, presentValue, gainLoss, portfolioPercentage
    };
  });
};

export async function fetchPortfolioData(): Promise<PortfolioStock[]> {
  const response = await axios.get('/api/portfolio');
  return processData(response.data);
};
