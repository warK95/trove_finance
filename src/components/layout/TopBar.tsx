import { Bell, HelpCircle, Search } from 'lucide-react';

export function TopBar() {
  return (
    <div className="flex items-center gap-4 border-b border-border bg-card py-4 pl-16 pr-4 lg:pl-8 lg:pr-8">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-disabled" aria-hidden />
        <input
          type="text"
          placeholder="Search stocks, crypto..."
          className="w-full rounded-xl border border-transparent bg-surfaceMuted py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-disabled focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-neutral transition hover:bg-surfaceMuted"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-neutral transition hover:bg-surfaceMuted"
          aria-label="Help"
        >
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
