'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CategoryModal } from '@/components/categories/CategoryModal';
import { GlobalAppAuthGuard } from '@/components/auth/GlobalAppAuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalAppAuthGuard>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 font-sans antialiased w-full max-w-full overflow-x-hidden">
        {/* Mobile Top Bar & Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area - Full Width on Mobile */}
        <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
          <Header />
          <main className="flex-1 p-3 sm:p-5 md:p-8 overflow-y-auto overflow-x-hidden bg-slate-50 w-full">
            {children}
          </main>
        </div>

        {/* Category CRUD Modal */}
        <CategoryModal />
      </div>
    </GlobalAppAuthGuard>
  );
}
