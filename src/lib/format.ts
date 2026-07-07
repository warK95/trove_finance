const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(currency: string): Intl.NumberFormat {
  if (!currencyFormatterCache.has(currency)) {
    currencyFormatterCache.set(
      currency,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  return currencyFormatterCache.get(currency)!;
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return getCurrencyFormatter(currency).format(value);
}

/** Currency string with an explicit leading + or - sign. */
export function formatSignedCurrency(value: number, currency = 'USD'): string {
  const formatted = formatCurrency(Math.abs(value), currency);
  return value < 0 ? `-${formatted}` : `+${formatted}`;
}

export function formatPercent(value: number, options?: { showSign?: boolean; decimals?: number }): string {
  const decimals = options?.decimals ?? 2;
  const fixed = Math.abs(value).toFixed(decimals);
  if (!options?.showSign) return `${fixed}%`;
  return `${value < 0 ? '-' : '+'}${fixed}%`;
}

export function formatShares(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
}
