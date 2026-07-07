import { AlertTriangle, Loader2, SearchX } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-ink-neutral">
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulseSoft rounded-2xl bg-surfaceMuted', className)} aria-hidden />;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-card border border-negative/20 bg-negative/5 p-8 text-center">
      <AlertTriangle className="h-6 w-6 text-negative" aria-hidden />
      <p className="text-sm text-ink">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center text-ink-neutral">
      <SearchX className="h-5 w-5" aria-hidden />
      <p className="text-sm">{message}</p>
    </div>
  );
}
