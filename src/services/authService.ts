import { isValidEmail } from '@/lib/validation/emailValidator';

export interface LoginResult {
  name: string;
  email: string;
}

export class AuthServiceError extends Error {}

/**
 * Client-side auth service. AuthContext is the only caller - no
 * component calls fetch() directly. Runs the same basic validation
 * the API route re-runs, purely so obviously-invalid submissions fail
 * fast without a round trip; the server-side check is what actually
 * matters.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  if (!email || !password) {
    throw new AuthServiceError('Email and password cannot be left empty.');
  }
  if (!isValidEmail(email)) {
    throw new AuthServiceError('Please enter a valid email address.');
  }

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new AuthServiceError(body?.message ?? 'Sign-in failed. Please try again.');
  }

  return body.user as LoginResult;
}
