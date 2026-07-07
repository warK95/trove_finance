// Shapes for the raw mock "database" record.
export interface Holding {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
}

export type TransactionType = 'BUY' | 'SELL';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export interface Transaction {
  id: string;
  type: TransactionType;
  ticker: string;
  name: string;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  date: string;
  status: TransactionStatus;
}

export interface RawPortfolioData {
  user: { name: string; accountId: string; lastUpdated: string };
  summary: { totalPortfolioValue: number; totalInvested: number; currency: string };
  holdings: Holding[];
  transactions: Transaction[];
}

// Shapes PortfolioService derives and the client actually consumes.

/** A holding annotated with everything the UI needs to render it. */
export interface HoldingView extends Holding {
  /** shares * currentPrice, or 0 when priceUnavailable is true. */
  marketValue: number;
  /** shares * avgCost. Always computed, even when price is unavailable. */
  costBasis: number;
  /** marketValue - costBasis, or 0 when priceUnavailable is true. */
  gainAmount: number;
  /** gainAmount / costBasis * 100, or 0 when priceUnavailable is true. */
  gainPercent: number;
  /** true when currentPrice is 0/missing on an otherwise-active holding (e.g. NVDA). */
  priceUnavailable: boolean;
}

export interface PortfolioSummary {
  netWorth: number;
  totalInvested: number;
  overallGainAmount: number;
  overallGainPercent: number;
  currency: string;
  lastUpdated: string;
  /** Count of active holdings left out of the totals above because pricing is unavailable. */
  excludedHoldingsCount: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percent: number;
  color: string;
}

export interface AccountGroup {
  sector: string;
  positionCount: number;
  totalValue: number;
}

export interface PortfolioResponse {
  user: { name: string; accountId: string };
  summary: PortfolioSummary;
  holdings: HoldingView[];
  allocation: SectorAllocation[];
  accounts: AccountGroup[];
  transactions: Transaction[];
}
