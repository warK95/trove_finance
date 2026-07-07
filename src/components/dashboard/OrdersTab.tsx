'use client';

import { useMemo, useState } from 'react';
import { FilterPills } from './FilterPills';
import { TransactionRow } from './TransactionRow';
import { EmptyState } from '@/components/ui/Feedback';
import type { Transaction } from '@/types/portfolio';

const FILTERS = ['All', 'Buy', 'Sell'] as const;
type Filter = (typeof FILTERS)[number];

export function OrdersTab({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return transactions;
    return transactions.filter((t) => t.type === filter.toUpperCase());
  }, [transactions, filter]);

  return (
    <div>
      <div className="mb-4">
        <FilterPills options={[...FILTERS]} value={filter} onChange={setFilter} />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState message="No transactions match this filter." />
        ) : (
          filtered.map((t) => <TransactionRow key={t.id} transaction={t} />)
        )}
      </div>
    </div>
  );
}
