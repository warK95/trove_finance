'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchPortfolio, PortfolioServiceError } from '@/services/portfolioService';
import type { PortfolioResponse } from '@/types/portfolio';

interface DashboardContextValue {
  data: PortfolioResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

/**
 * Fetches once on mount via the client service layer and exposes
 * { data, isLoading, error, refetch }. Every dashboard component is a
 * plain consumer of this context - none of them fetch or know about
 * the API route directly.
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchPortfolio()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof PortfolioServiceError ? err.message : 'Unable to load your portfolio right now.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return (
    <DashboardContext.Provider value={{ data, isLoading, error, refetch }}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider');
  return ctx;
}
