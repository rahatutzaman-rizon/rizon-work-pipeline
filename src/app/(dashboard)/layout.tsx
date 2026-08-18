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
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50">
            {children}
          </main>
        </div>

        {/* Category CRUD Modal */}
        <CategoryModal />
      </div>
    </GlobalAppAuthGuard>
  );
}
