'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { Eye, EyeOff, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { PortfolioSummary } from '@/types/portfolio';

const PERIODS = ['1D', '1W', '1M', 'ALL'] as const;
type Period = (typeof PERIODS)[number];

/**
 * The provided dataset has no historical net-worth time series, so
 * this sparkline is illustrative rather than real history: a smooth,
 * deterministic path that always ends exactly at the real, computed
 * net worth. It exists purely for visual rhythm on the card - see
 * README, "Other notable decisions".
 */
function buildIllustrativeSeries(endValue: number, seed: number) {
  const points = 24;
  const safeEnd = endValue || 1;
  const series = Array.from({ length: points }, (_, i) => {
    const progress = i / (points - 1);
    const wave = Math.sin(progress * Math.PI * 2 + seed) * 0.04 + Math.sin(progress * Math.PI * 5 + seed) * 0.015;
    const trend = 0.9 + progress * 0.1;
    return { i, value: safeEnd * (trend + wave) };
  });
  series[series.length - 1] = { i: points - 1, value: safeEnd };
  return series;
}

const PERIOD_SEED: Record<Period, number> = { '1D': 0.4, '1W': 1.1, '1M': 2.3, ALL: 3.7 };

export function NetWorthCard({ summary }: { summary: PortfolioSummary }) {
  const [hidden, setHidden] = useState(false);
  const [period, setPeriod] = useState<Period>('1D');
  const isPositive = summary.overallGainPercent >= 0;

  const series = useMemo(
    () => buildIllustrativeSeries(summary.netWorth, PERIOD_SEED[period]),
    [summary.netWorth, period]
  );

  return (
    <Card className="flex flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-sm text-ink-neutral">
          Total Net Worth
          <Info className="h-3.5 w-3.5" aria-hidden />
        </div>
        <div className="flex flex-shrink-0 rounded-full bg-surfaceMuted p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                period === p ? 'bg-card text-ink shadow-sm' : 'text-ink-neutral'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-1 flex items-center gap-3">
        <span className="text-[27px] font-semibold tracking-tight text-ink">
          {hidden ? '••••••' : formatCurrency(summary.netWorth, summary.currency)}
        </span>
        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          aria-label={hidden ? 'Show balance' : 'Hide balance'}
          className="text-ink-disabled transition hover:text-ink-neutral"
        >
          {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className={`mb-4 flex items-center gap-1.5 text-sm font-medium ${isPositive ? 'text-success' : 'text-negative'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        {formatPercent(summary.overallGainPercent, { showSign: true })}
        <span className="font-normal text-ink-disabled">overall</span>
      </div>

      <div className="-mx-2 h-24 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059A83" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#059A83" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Area type="monotone" dataKey="value" stroke="#059A83" strokeWidth={2} fill="url(#netWorthGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {summary.excludedHoldingsCount > 0 && (
        <p className="mt-3 text-[11px] text-ink-disabled">
          {summary.excludedHoldingsCount} holding{summary.excludedHoldingsCount > 1 ? 's' : ''} excluded from totals —
          price unavailable.
        </p>
      )}
    </Card>
  );
}
