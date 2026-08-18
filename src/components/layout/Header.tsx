'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sparkles, Plus, Command, Home, ChevronRight, Lock, FileDown } from 'lucide-react';
import { useCategoryStore } from '@/lib/store/category-store';
import { logoutGlobalAdmin } from '@/lib/global-auth';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { openCreateModal } = useCategoryStore();

  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <header className="h-16 bg-white sticky top-0 z-20 px-3 sm:px-6 flex items-center justify-between border-b border-emerald-100/80 shadow-xs gap-2">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
        <Link href="/dashboard" className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 shrink-0">
          <Home className="w-4 h-4 text-emerald-600" />
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
        <span className="capitalize font-bold text-slate-800 truncate text-xs sm:text-sm">
          {pathSegments[0] || 'Dashboard'}
        </span>
        {pathSegments.slice(1).map((seg, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-300 shrink-0 hidden sm:inline" />
            <span className="capitalize text-emerald-700 font-bold truncate hidden sm:inline text-xs">
              {seg.replace(/-/g, ' ')}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right: Quick Search, Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Search Bar Trigger */}
        <div className="relative hidden lg:block">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50/50 border border-emerald-200/60 rounded-xl text-xs text-slate-500 w-56 xl:w-64 hover:border-emerald-400 cursor-pointer transition-all">
            <Search className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Search notes & topics...</span>
            <kbd className="ml-auto px-1.5 py-0.5 bg-white border border-emerald-200 rounded text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </div>

        {/* AI Quick Button */}
        <Link
          href="/agents/chat"
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          title="AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Link>

        {/* Quick Domain/Subject Add Button */}
        <button
          onClick={() => openCreateModal(null)}
          className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden xs:inline">New Subject</span>
        </button>

        {/* PDF Testing Report Download Button */}
        <a
          href="/api/report/pdf"
          download="RIZON_Full_System_Testing_Report.pdf"
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          title="Download Full Testing Report (PDF)"
        >
          <FileDown className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="hidden xl:inline">PDF Report</span>
        </a>

        {/* Lock Portal Button */}
        <button
          onClick={() => {
            if (confirm('Lock RIZON Portal? Access password will be required to re-enter.')) {
              logoutGlobalAdmin();
              window.location.reload();
            }
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Lock Portal / Admin Logout"
        >
          <Lock className="w-3.5 h-3.5 text-slate-500 hover:text-red-600 shrink-0" />
          <span className="hidden md:inline">Lock Portal</span>
        </button>
      </div>
    </header>
  );
};
