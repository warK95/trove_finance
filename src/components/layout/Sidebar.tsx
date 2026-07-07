'use client';

import { useState } from 'react';
import { ArrowLeftRight, Briefcase, LayoutGrid, LineChart, Menu, Settings, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutGrid, active: true },
  { label: 'Portfolio', icon: Briefcase },
  { label: 'Transactions', icon: ArrowLeftRight },
  { label: 'Markets', icon: LineChart },
  { label: 'Settings', icon: Settings },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function SidebarContent() {
  const { user, logout } = useAuth();
  const displayName = user?.name ?? 'Trove User';

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          T
        </div>
        <span className="text-lg font-semibold text-primary">Trove</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              active ? 'bg-primary-light text-primary' : 'text-ink-neutral hover:bg-surfaceMuted'
            )}
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(displayName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{displayName}</p>
            <p className="text-xs text-ink-neutral">Premium Member</p>
          </div>
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          Add Funds
        </button>
        <button
          type="button"
          onClick={logout}
          className="mt-2 w-full rounded-xl py-2 text-xs font-medium text-ink-neutral transition hover:text-negative"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-ink" />
      </button>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setIsOpen(false)} aria-hidden />
          <div className="absolute left-0 top-0 h-full w-72 animate-fadeInUp shadow-xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-surfaceMuted"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
