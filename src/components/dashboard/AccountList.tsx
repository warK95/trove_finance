import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/format';
import type { AccountGroup } from '@/types/portfolio';

export function AccountList({ accounts, currency }: { accounts: AccountGroup[]; currency: string }) {
  if (accounts.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-ink">Portfolio Breakdown</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {accounts.map((account) => (
          <Card key={account.sector} className="p-4">
            <p className="truncate text-xs text-ink-neutral">{account.sector}</p>
            <p className="mt-1.5 text-sm font-medium text-ink">{formatCurrency(account.totalValue, currency)}</p>
            <p className="mt-1 text-[11px] text-ink-disabled">
              {account.positionCount} position{account.positionCount !== 1 ? 's' : ''}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
