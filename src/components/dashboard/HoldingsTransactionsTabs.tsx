'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { StocksTab } from './StocksTab';
import { OrdersTab } from './OrdersTab';
import { cn } from '@/lib/cn';
import type { HoldingView, Transaction } from '@/types/portfolio';

const TABS = ['stocks', 'orders'] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = { stocks: 'Stocks', orders: 'Orders' };

export function HoldingsTransactionsTabs({
  holdings,
  transactions,
  currency,
}: {
  holdings: HoldingView[];
  transactions: Transaction[];
  currency: string;
}) {
  const [tab, setTab] = useState<Tab>('stocks');

  return (
    <Card>
      <div className="mb-5 inline-flex rounded-xl bg-surfaceMuted p-1" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition',
              tab === t ? 'bg-card text-ink shadow-sm' : 'text-ink-neutral'
            )}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === 'stocks' ? (
        <StocksTab holdings={holdings} currency={currency} />
      ) : (
        <OrdersTab transactions={transactions} />
      )}
    </Card>
  );
}
