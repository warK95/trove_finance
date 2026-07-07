'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/Card';
import { formatPercent } from '@/lib/format';
import type { SectorAllocation } from '@/types/portfolio';

export function AllocationCard({ allocation }: { allocation: SectorAllocation[] }) {
  // Recharts wants one row of data with a key per stacked segment,
  // e.g. { name: 'Portfolio', Technology: 42.5, Automotive: 13.0, ... }
  const chartData = [
    allocation.reduce<Record<string, number | string>>(
      (acc, item) => ({ ...acc, [item.sector]: item.percent }),
      { name: 'Portfolio' }
    ),
  ];

  return (
    <Card>
      <p className="mb-4 text-sm text-ink-neutral">Asset Allocation</p>

      {allocation.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-disabled">No priced holdings to allocate yet.</p>
      ) : (
        <>
          <div className="mb-5 h-8 w-full overflow-hidden rounded-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" barSize={32} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis type="category" dataKey="name" hide />
                {allocation.map((item) => (
                  <Bar key={item.sector} dataKey={item.sector} stackId="allocation" fill={item.color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {allocation.map((item) => (
              <div key={item.sector} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-inset ring-black/5"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="truncate text-xs text-ink-neutral">{item.sector}</p>
                  <p className="text-sm font-medium text-ink">{formatPercent(item.percent, { decimals: 1 })}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
