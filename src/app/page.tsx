'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Feedback';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (isInitializing) return;
    router.replace(isAuthenticated ? '/dashboard' : '/login');
  }, [isInitializing, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page">
      <Spinner label="Loading Trove..." />
    </div>
  );
}
