import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CategoryModal } from '@/components/categories/CategoryModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
          {children}
        </main>
      </div>

      {/* Category CRUD Modal */}
      <CategoryModal />
    </div>
  );
}
