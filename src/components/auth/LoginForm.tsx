'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/lib/validation/emailValidator';
import { sanitizeEmailInput, sanitizePassword } from '@/lib/validation/sanitizeInput';
import { Button } from '@/components/ui/Button';

interface FieldErrors {
  email?: string;
  password?: string;
}

interface Touched {
  email: boolean;
  password: boolean;
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) {
    errors.email = 'Email address cannot be left empty.';
  } else if (!isValidEmail(email.trim())) {
    errors.email = 'Enter a valid email address, e.g. name@example.com.';
  }
  if (!password) {
    errors.password = 'Password cannot be left empty.';
  }
  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const { login, isSubmitting, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Touched>({ email: false, password: false });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();

    const errors = validate(email, password);
    setFieldErrors(errors);
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length > 0) return;

    const success = await login(email.trim(), password);
    if (success) router.push('/dashboard');
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative z-10 w-full max-w-[420px] rounded-card border border-border bg-card p-8 shadow-[0_20px_60px_-15px_rgba(19,52,47,0.15)]"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
          T
        </div>
        <h1 className="text-xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-neutral">Sign in to your account</p>
      </div>

      {authError && (
        <div
          role="alert"
          className="mb-5 flex animate-fadeInUp items-start gap-2 rounded-xl border border-negative/20 bg-negative/5 p-3 text-sm text-negative"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
          <span>{authError}</span>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink-neutral">
          Email address
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            const clean = sanitizeEmailInput(e.target.value);
            setEmail(clean);
            if (touched.email) setFieldErrors(validate(clean, password));
          }}
          onBlur={() => {
            setTouched((t) => ({ ...t, email: true }));
            setFieldErrors(validate(email, password));
          }}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          className={`w-full rounded-xl border bg-surfaceMuted px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-disabled focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            fieldErrors.email ? 'border-negative' : 'border-transparent'
          }`}
        />
        {fieldErrors.email && (
          <p id="email-error" className="mt-1.5 animate-fadeInUp text-xs text-negative">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="mb-2">
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-ink-neutral">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              const clean = sanitizePassword(e.target.value);
              setPassword(clean);
              if (touched.password) setFieldErrors(validate(email, clean));
            }}
            onBlur={() => {
              setTouched((t) => ({ ...t, password: true }));
              setFieldErrors(validate(email, password));
            }}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            className={`w-full rounded-xl border bg-surfaceMuted px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-ink-disabled focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              fieldErrors.password ? 'border-negative' : 'border-transparent'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-disabled transition hover:text-ink-neutral"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <p id="password-error" className="mt-1.5 animate-fadeInUp text-xs text-negative">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div className="mb-5 text-right">
        <a href="#" className="text-xs font-medium text-primary hover:underline">
          Forgot password?
        </a>
      </div>

      <Button type="submit" isLoading={isSubmitting} loadingText="Signing in..." className="w-full">
        Sign in
      </Button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-ink-disabled">Don&apos;t have an account?</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        className="w-full rounded-xl border border-border bg-card py-2.5 text-sm font-medium text-ink transition hover:bg-surfaceMuted"
      >
        Create a Trove account
      </button>
    </form>
  );
}
