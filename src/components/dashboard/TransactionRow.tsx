import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, formatShares } from '@/lib/format';
import type { Transaction } from '@/types/portfolio';

const STATUS_BADGE: Record<Transaction['status'], { variant: 'success' | 'pending' | 'failed'; label: string }> = {
  COMPLETED: { variant: 'success', label: 'Completed' },
  PENDING: { variant: 'pending', label: 'Pending' },
  FAILED: { variant: 'failed', label: 'Failed' },
};

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isBuy = transaction.type === 'BUY';
  const isFailed = transaction.status === 'FAILED';
  // Buys are cash outflows, sells are cash inflows - shown with sign
  // accordingly, but a FAILED order never actually moved money, so
  // its amount is muted rather than colored like a real gain/loss.
  const signedAmount = isBuy ? -transaction.totalAmount : transaction.totalAmount;
  const badge = STATUS_BADGE[transaction.status];

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
            isBuy ? 'bg-primary-light text-primary' : 'bg-surfaceMuted text-ink-neutral'
          }`}
        >
          {isBuy ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">
            {isBuy ? 'Buy' : 'Sell'} {transaction.name}
          </p>
          <p className="truncate text-xs text-ink-neutral">
            {formatDate(transaction.date)} • {formatShares(transaction.shares)} shares
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <p className={`text-sm font-medium ${isFailed ? 'text-ink-disabled' : isBuy ? 'text-ink' : 'text-success'}`}>
          {signedAmount >= 0 ? '+' : '-'}
          {formatCurrency(Math.abs(signedAmount), 'USD')}
        </p>
        <Badge variant={badge.variant} className="mt-1">
          {badge.label}
        </Badge>
      </div>
    </div>
  );
}
