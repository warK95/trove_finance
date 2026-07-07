import type { PortfolioResponse } from '@/types/portfolio';

export class PortfolioServiceError extends Error {}

/**
 * Client-side service layer, per the brief: "Create a service layer
 * that wraps the JSON data and simulates asynchronous API calls...
 * components should consume data through this service layer." No
 * component ever imports portfolio-data.json, or even knows it
 * exists - they only ever call fetchPortfolio(), which wraps our own
 * /api/portfolio endpoint and normalizes failures into one error type.
 */
export async function fetchPortfolio(options?: { simulateError?: boolean }): Promise<PortfolioResponse> {
  const url = options?.simulateError ? '/api/portfolio?simulateError=1' : '/api/portfolio';
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new PortfolioServiceError(body?.message ?? 'Unable to load portfolio data.');
  }

  return response.json() as Promise<PortfolioResponse>;
}
