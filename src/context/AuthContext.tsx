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
// Purely so refreshing /dashboard doesn't bounce back to /login; see
// README for why this isn't (and doesn't need to be) "at rest
// encryption."
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
      const result = await loginRequest(email, password);
      setUser(result);
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(result));
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
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  const clearError = useCallback(() => setError(null), []);

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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
