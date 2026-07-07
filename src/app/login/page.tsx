import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-light opacity-60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-primary-light opacity-50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-1/4 top-1/3 h-56 w-56 rounded-full bg-accentBlue/10 blur-3xl" />

      <LoginForm />
    </main>
  );
}
