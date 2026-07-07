import { fetchRawPortfolioData } from './portfolioRepository';
import {
  computeAccounts,
  computeAllocation,
  computeHoldingViews,
  computeSummary,
} from '@/lib/calculations/portfolioCalculations';
import type { PortfolioResponse } from '@/types/portfolio';

/**
 * PortfolioService
 * -----------------
 * Owns domain logic: turning raw, occasionally messy, storage records
 * into the shape the UI actually wants - net worth, per-holding
 * gain/loss, sector allocation, account groupings - all computed here
 * via the pure functions in lib/calculations, not scattered across
 * components. That keeps display code "dumb" and keeps every data-quirk
 * decision (see README) in one reviewable place.
 */
export async function getPortfolioForClient(): Promise<PortfolioResponse> {
  const raw = await fetchRawPortfolioData();

  const holdings = computeHoldingViews(raw.holdings);
  const summary = computeSummary(holdings, raw);
  const allocation = computeAllocation(holdings);
  const accounts = computeAccounts(holdings);
  const transactions = [...raw.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return {
    user: { name: raw.user.name, accountId: raw.user.accountId },
    summary,
    holdings,
    allocation,
    accounts,
    transactions,
  };
}
