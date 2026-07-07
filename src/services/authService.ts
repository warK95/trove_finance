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
  // I intentionally implemented the same validation here as in the API route, even though it's redundant, so that obviously-invalid submissions fail fast without a round trip. The server-side check is what actually matters.
  if (!email || !password) {
    throw new AuthServiceError('Email and password cannot be left empty.');
  }
  // I intentionally implemented the same validation here as in the API route, even though it's redundant, so that obviously-invalid submissions fail fast without a round trip. The server-side check is what actually matters.
  if (!isValidEmail(email)) {
    throw new AuthServiceError('Please enter a valid email address.');
  }

  // Note: this is a mock implementation of the login request. In a real application, you would replace this with an actual API call to your backend server.
  // Here i implemented a nextJS serverless function to handle the login request. The serverless function is responsible for validating the email and password, 
  // and returning a response indicating whether the login was successful or not.
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const body = await response.json().catch(() => null); // If any error occurs while parsing the response body, it will be caught and handled gracefully by returning null. This prevents the application from crashing due to unexpected response formats or server errors.

  if (!response.ok || !body?.success) {
    throw new AuthServiceError(body?.message ?? 'Sign-in failed. Please try again.');
  }

  return body.user as LoginResult;
}
