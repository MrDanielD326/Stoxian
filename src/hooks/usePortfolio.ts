import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PortfolioStock } from '@/types/portfolio';
import { fetchPortfolioData } from '@/api/portfolio';

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPortfolioData();
      setPortfolio(data);
      setLastUpdated(new Date());
    } catch {
      setError('Failed to fetch portfolio data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const refresh = () => fetchData(true);

  const summary = useMemo(() => {
    const totalInvestment = portfolio.reduce((acc, stock) => acc + stock.investment, 0);
    const totalPresentValue = portfolio.reduce((acc, stock) => acc + stock.presentValue, 0);
    const totalGainLoss = totalPresentValue - totalInvestment;
    return { totalInvestment, totalPresentValue, totalGainLoss };
  }, [portfolio]);

  return { portfolio, isLoading, error, lastUpdated, refresh, summary };
} 