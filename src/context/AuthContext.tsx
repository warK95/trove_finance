'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthServiceError, login as loginRequest, type LoginResult } from '@/services/authService';

interface AuthContextValue {
  user: LoginResult | null;
  isAuthenticated: boolean;
  /** True while restoring a session from storage on first load. */
  isInitializing: boolean;
  /** True while a login request is in flight - drives the button's loading state. */
  isSubmitting: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Only ever holds { name, email } - never a password, never a token.
// Purely so refreshing /dashboard doesn't bounce back to /login; 
// see README.md for the reasoning behind this design decision.
const SESSION_STORAGE_KEY = 'trove.session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResult | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // Corrupt/unavailable storage should never block the app.
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Note: this is a mock implementation of the login request. In a real application, you would replace this with an actual API call to your backend server.
      // Simulate a network delay for demonstration purposes
      // calls the loginRequest function from the authService.ts file to perform the actual login operation.
      // the loginRequest function is responsible for sending the login request to the server and returning the result.
      // since there is no backend server, the loginRequest function is a mock implementation that simulates a successful login response.
      const result = await loginRequest(email, password);
      setUser(result); // takes the result of the loginRequest function and sets it as the user state using the setUser function. This updates the context with the authenticated user's information.
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(result)); // Store the authenticated user's information in the session storage for persistence across page reloads.
      return true;
    } catch (err) {
      setError(err instanceof AuthServiceError ? err.message : 'Something went wrong. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY); // On logout delete the session from the local storage to ensure that the user is logged out and their session is cleared. This ensures that the user will need to log in again to access protected routes or perform authenticated actions. improving security and preventing unauthorized access to sensitive information.
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // using memoization hook to store the auth context value. 
  // This ensures that the context value is only recalculated when one of its dependencies changes (user, isInitializing, isSubmitting, error, login, logout, clearError), 
  // preventing unnecessary re-renders of components that consume the context.
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      isSubmitting,
      error,
      login,
      logout,
      clearError,
    }),
    [user, isInitializing, isSubmitting, error, login, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext); // created context using createContext and provided it to the component tree using AuthProvider. 
  // useAuth is a custom hook that allows components to access the authentication context and its values. 
  // It retrieves the context value using useContext(AuthContext) and returns it for use in components.
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider'); // Ensures that the hook is used within the AuthProvider component, otherwise it throws an error. 
  // This prevents components from accessing the authentication context outside of the provider, which would result in undefined values and potential errors.
  return ctx;
}
