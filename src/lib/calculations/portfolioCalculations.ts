import type {
  AccountGroup,
  Holding,
  HoldingView,
  PortfolioSummary,
  RawPortfolioData,
  SectorAllocation,
} from '@/types/portfolio';

/**
 * All pure. No I/O, no framework code - easy to unit test and safe to
 * call from both the server (PortfolioService) and, if this ever grew
 * a "recompute on the client" need, from the client too.
 *
 * This file is also where every "intentional data quirk" decision
 * from the brief actually lives, in one place. See README.md for the
 * reasoning behind each one; the short version is inline below.
 */

// Trove v3 palette colors, reused here for the allocation chart
// segments. Falls back to the palette's other chart-segment colors
// for any sector not explicitly mapped.
const SECTOR_COLORS: Record<string, string> = {
  Technology: '#059A83', // Primary
  Automotive: '#00B6DF', // Accent blue
  Healthcare: '#E0F5E1', // Primary light
  Finance: '#7B79C9', // Purple
  Entertainment: '#F2C891', // Cream
};
const FALLBACK_SECTOR_COLORS = ['#059A83', '#00B6DF', '#7B79C9', '#F2C891', '#00323D'];

/**
 * A function to determine if a holding is closed or not.
 * @param holding The data type that describes a holding position.
 * @returns A boolean indicating if the holding position is closed (true) or not (false).
 */
export function isClosedPosition(holding: Holding): boolean {
  /** Quirk #2 (DIS): 0 shares means the position is closed, not active. */
  return holding.shares <= 0;
}

/**
 * Checks to see if a holding price is available or missing.
 * @param holding The data type that describes a holding position.
 * @returns A boolean indicating if the price for a particular holding is available or not.
 */
export function isPriceUnavailable(holding: Holding): boolean {
  /** Quirk #1 (NVDA): a 0/missing price means "unavailable", not "worthless". */
  return !isClosedPosition(holding) && !(holding.currentPrice > 0);
}

/**
 * Filters out closed positions (quirk #2) and annotates every
 * remaining holding with derived values, flagging - but not
 * discarding - holdings with unavailable pricing (quirk #1).
 */
export function computeHoldingViews(holdings: Holding[]): HoldingView[] {
  return holdings
    .filter((h) => !isClosedPosition(h))
    .map((h) => {
      const priceUnavailable = isPriceUnavailable(h); // Gets the boolean const state for price availability
      const marketValue = priceUnavailable ? 0 : h.shares * h.currentPrice; // use tenary ops to compute market value.
      const costBasis = h.shares * h.avgCost;
      const gainAmount = priceUnavailable ? 0 : marketValue - costBasis; // use tenary ops to compute gain.
      const gainPercent = priceUnavailable || costBasis === 0 ? 0 : (gainAmount / costBasis) * 100; // applied tenary ops to calculate percentage gain.

      return {
        ...h, // use the spread ops to pass unnamed args.
        marketValue,
        costBasis,
        gainAmount,
        gainPercent,
        priceUnavailable,
      };
    });
}

/**
 * Net worth, computed live from `holdings` - never from the JSON's
 * top-level `summary` block. That block (totalPortfolioValue:
 * 48250.75) doesn't reconcile with what the holdings array actually
 * adds up to, which is exactly why the brief asks for net worth
 * "computed from all holdings": a pre-aggregated field can drift from
 * the source of truth. Holdings with unavailable pricing are excluded
 * from both sides of the gain/loss comparison so the percentage stays
 * internally consistent (see README quirk #1).
 */
export function computeSummary(holdings: HoldingView[], raw: RawPortfolioData): PortfolioSummary {
  const priced = holdings.filter((h) => !h.priceUnavailable);
  const netWorth = priced.reduce((sum, h) => sum + h.marketValue, 0);
  const totalInvested = priced.reduce((sum, h) => sum + h.costBasis, 0);
  const overallGainAmount = netWorth - totalInvested;
  const overallGainPercent = totalInvested === 0 ? 0 : (overallGainAmount / totalInvested) * 100;

  return {
    netWorth,
    totalInvested,
    overallGainAmount,
    overallGainPercent,
    currency: raw.summary?.currency ?? 'USD',
    lastUpdated: raw.user?.lastUpdated ?? new Date().toISOString(),
    excludedHoldingsCount: holdings.length - priced.length,
  };
}

/**
 * Sector breakdown for the allocation bar. Sectors with $0 of priced
 * value (Entertainment, once DIS is excluded as a closed position)
 * are dropped entirely rather than shown as an empty 0% segment.
 */
export function computeAllocation(holdings: HoldingView[]): SectorAllocation[] {
  const total = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const bySector = new Map<string, number>();

  for (const h of holdings) {
    bySector.set(h.sector, (bySector.get(h.sector) ?? 0) + h.marketValue);
  }

  return Array.from(bySector.entries())
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([sector, value], index) => ({
      sector,
      value,
      percent: total === 0 ? 0 : (value / total) * 100,
      color: SECTOR_COLORS[sector] ?? FALLBACK_SECTOR_COLORS[index % FALLBACK_SECTOR_COLORS.length],
    }));
}

/**
 * Account/category cards, grouped by sector (the brief asks to
 * "group holdings by sector or account type" derived from the actual
 * data - not the wireframe's US Portfolio / NG Portfolio / Fixed
 * Income / GEMS labels, which have no basis in the provided JSON).
 * Position counts include holdings with unavailable pricing (you do
 * still hold the shares); dollar totals do not (we don't fabricate a
 * value for them).
 */
export function computeAccounts(holdings: HoldingView[]): AccountGroup[] {
  const bySector = new Map<string, { count: number; value: number }>();

  for (const h of holdings) {
    const entry = bySector.get(h.sector) ?? { count: 0, value: 0 };
    entry.count += 1;
    entry.value += h.priceUnavailable ? 0 : h.marketValue;
    bySector.set(h.sector, entry);
  }

  return Array.from(bySector.entries())
    .map(([sector, { count, value }]) => ({ sector, positionCount: count, totalValue: value }))
    .sort((a, b) => b.totalValue - a.totalValue);
}
