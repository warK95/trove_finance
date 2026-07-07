import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioForClient } from '@/server/portfolioService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio
 *
 * The only public surface for portfolio data - the client-side
 * service layer (src/services/portfolioService.ts) talks to this and
 * nothing else. Supports ?simulateError=1 so the error/retry UI can
 * be demoed on demand without making the deployed app flaky by
 * default for reviewers.
 */
export async function GET(request: NextRequest) {
  const simulateError = request.nextUrl.searchParams.get('simulateError');

  if (simulateError) {
    return NextResponse.json(
      { message: 'Simulated failure: could not reach the portfolio service.' },
      { status: 500 }
    );
  }

  try {
    const data = await getPortfolioForClient();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Failed to load portfolio data:', error);
    return NextResponse.json(
      { message: 'Something went wrong while loading your portfolio.' },
      { status: 500 }
    );
  }
}
