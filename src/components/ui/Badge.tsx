import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'success' | 'pending' | 'failed' | 'neutral';

// Trove v3 doesn't define a dedicated "warning/pending" token, so the
// Cream chart-segment color is repurposed here for that role - the
// closest visual match to the wireframe's amber "PENDING" pill. See
// README, quirk #3.
const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success',
  pending: 'bg-accentCream/30 text-[#8A6512]',
  failed: 'bg-negative/10 text-negative',
  neutral: 'bg-surfaceMuted text-ink-neutral',
};

export function Badge({
  variant = 'neutral',
  children,
  className,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
