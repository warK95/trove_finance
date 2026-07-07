import { formatCurrency, formatPercent, formatShares, formatSignedCurrency } from '@/lib/format';
import type { HoldingView } from '@/types/portfolio';

export function HoldingCard({ holding, currency }: { holding: HoldingView; currency: string }) {
  const isGain = holding.gainAmount >= 0;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-light text-xs font-bold text-primary">
          {holding.ticker.slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{holding.ticker}</p>
          <p className="truncate text-xs text-ink-neutral">{holding.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-8">
        <p className="flex-shrink-0 text-xs text-ink-neutral">{formatShares(holding.shares)} shares</p>

        <div className="flex-shrink-0 text-right">
          {holding.priceUnavailable ? (
            <p className="text-xs font-medium text-ink-disabled" title="Price feed unavailable for this holding">
              Price unavailable
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-ink">{formatCurrency(holding.marketValue, currency)}</p>
              <p className={`text-xs font-medium ${isGain ? 'text-success' : 'text-negative'}`}>
                {formatSignedCurrency(holding.gainAmount, currency)} ({formatPercent(holding.gainPercent, { showSign: true })})
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
