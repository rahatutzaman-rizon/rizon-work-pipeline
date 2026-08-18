'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardPage from './(dashboard)/dashboard/page';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return <DashboardPage />;
}
