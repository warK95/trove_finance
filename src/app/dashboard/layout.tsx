'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { Spinner } from '@/components/ui/Feedback';

export default function DashboardRouteLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Spinner label="Checking your session..." />
      </div>
    );
  }

  return <DashboardProvider>{children}</DashboardProvider>;
}
