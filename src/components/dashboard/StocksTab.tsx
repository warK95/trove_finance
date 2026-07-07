'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { FilterPills } from './FilterPills';
import { HoldingCard } from './HoldingCard';
import { EmptyState } from '@/components/ui/Feedback';
import { sanitizeDisplayText } from '@/lib/validation/sanitizeInput';
import type { HoldingView } from '@/types/portfolio';

export function StocksTab({ holdings, currency }: { holdings: HoldingView[]; currency: string }) {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');

  const sectors = useMemo(() => ['All', ...Array.from(new Set(holdings.map((h) => h.sector)))], [holdings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return holdings.filter((h) => {
      const matchesSector = sector === 'All' || h.sector === sector;
      const matchesQuery = !q || h.ticker.toLowerCase().includes(q) || h.name.toLowerCase().includes(q);
      return matchesSector && matchesQuery;
    });
  }, [holdings, query, sector]);

  return (
    <div>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-disabled" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(sanitizeDisplayText(e.target.value, 60))}
          placeholder="Search by ticker or company name"
          className="w-full rounded-xl border border-border bg-surfaceMuted py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-disabled focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="mb-4">
        <FilterPills options={sectors} value={sector} onChange={setSector} />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState message="No holdings match your search." />
        ) : (
          filtered.map((h) => <HoldingCard key={h.id} holding={h} currency={currency} />)
        )}
      </div>
    </div>
  );
}
