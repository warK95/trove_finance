import { NextResponse } from 'next/server';
import { isValidEmail } from '@/lib/validation/emailValidator';
import { wait } from '@/lib/delay';

export const dynamic = 'force-dynamic';

// 0.85ms is imperceptible, so this is read as ~850ms - a realistic
// simulated round trip, applied server-side so the button's loading
// state reflects an actual (simulated) request rather than a fake
// client-side timer. See README.
const SIMULATED_LATENCY_MS = 850;

interface LoginRequestBody {
  email?: unknown;
  password?: unknown;
}

/**
 * POST /api/auth/login
 *
 * No real credential store exists per the assessment brief ("No real
 * authentication is needed - simulate a successful login on form
 * submission"). Any well-formed, non-empty submission is treated as a
 * success. Validation is re-run here even though LoginForm already
 * ran it client-side - client checks are a UX convenience, never the
 * actual security boundary. So i implemented a NextJS serverless function to handle the login request. 
 * The serverless function is responsible for validating the email and password,
 * and returning a response indicating whether the login was successful or not.
 * @param request The incoming request object containing the email and password in the body.
 * @returns A JSON response indicating the success or failure of the login attempt, along with an appropriate message.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginRequestBody | null;
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  await wait(SIMULATED_LATENCY_MS); // wait for a simulated latency to mimic a real network request (i chose 850 milliseconds as a realistic round trip time). This is applied server-side so the button's loading state reflects an actual (simulated) request rather than a fake client-side timer.

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: 'Email and password cannot be left empty.' },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, message: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  // The whole app demos one person's portfolio (the data in
  // data/portfolio-data.json), so the mocked session always resolves
  // to that account regardless of which credentials were entered -
  // there's no real user store to look up here.
  return NextResponse.json(
    {
      success: true,
      user: {
        name: 'Adaeze Okonkwo',
        email,
      },
    },
    { status: 200 }
  );
}
