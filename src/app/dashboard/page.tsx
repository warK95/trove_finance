'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { NetWorthCard } from '@/components/dashboard/NetWorthCard';
import { AllocationCard } from '@/components/dashboard/AllocationCard';
import { AccountList } from '@/components/dashboard/AccountList';
import { HoldingsTransactionsTabs } from '@/components/dashboard/HoldingsTransactionsTabs';
import { ErrorState, Skeleton } from '@/components/ui/Feedback';
import { useDashboard } from '@/context/DashboardContext';

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="flex-1 space-y-6 p-4 lg:p-8">
          {error && <ErrorState message={error} onRetry={refetch} />}

          {isLoading && !error && (
            <div className="animate-fadeInUp space-y-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
              <Skeleton className="h-96" />
            </div>
          )}

          {data && !error && (
            <div className="animate-fadeInUp space-y-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
                <NetWorthCard summary={data.summary} />
                <AllocationCard allocation={data.allocation} />
              </div>

              <AccountList accounts={data.accounts} currency={data.summary.currency} />

              <HoldingsTransactionsTabs
                holdings={data.holdings}
                transactions={data.transactions}
                currency={data.summary.currency}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
