import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export function Button({
  isLoading,
  loadingText,
  variant = 'primary',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'border border-border bg-card text-ink hover:bg-surfaceMuted',
  };

  return (
    <button className={cn(base, variants[variant], className)} disabled={disabled || isLoading} {...props}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      <span>{isLoading ? loadingText ?? 'Loading...' : children}</span>
    </button>
  );
}
