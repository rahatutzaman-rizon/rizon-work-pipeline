'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Sparkles, Plus, Command, Home, ChevronRight, BookOpen, Lock } from 'lucide-react';
import { useCategoryStore } from '@/lib/store/category-store';
import { logoutGlobalAdmin } from '@/lib/global-auth';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { openCreateModal } = useCategoryStore();

  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <header className="h-16 bg-white sticky top-0 z-20 px-6 flex items-center justify-between border-b border-emerald-100/80 shadow-xs">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Home className="w-4 h-4 text-emerald-600" />
        <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
        <span className="capitalize font-semibold text-slate-700">
          {pathSegments[0] || 'Dashboard'}
        </span>
        {pathSegments.slice(1).map((seg, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
            <span className="capitalize text-emerald-700 font-bold">{seg.replace(/-/g, ' ')}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Right: Quick Search, Actions, Notifications */}
      <div className="flex items-center gap-3">
        {/* Search Bar Trigger */}
        <div className="relative hidden md:block">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50/50 border border-emerald-200/60 rounded-xl text-xs text-slate-500 w-64 hover:border-emerald-400 cursor-pointer transition-all">
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>Search BCS notes, topics, PYQs...</span>
            <kbd className="ml-auto px-1.5 py-0.5 bg-white border border-emerald-200 rounded text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </div>

        {/* AI Quick Button */}
        <Link
          href="/agents/chat"
          className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="hidden sm:inline">AI Study Assistant</span>
        </Link>

        {/* Quick Domain/Subject Add Button */}
        <button
          onClick={() => openCreateModal(null)}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Subject</span>
        </button>

        {/* Lock Portal Button */}
        <button
          onClick={() => {
            if (confirm('Lock RIZON Portal? Password rizon321 will be required to re-enter.')) {
              logoutGlobalAdmin();
              window.location.reload();
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Lock Portal / Admin Logout"
        >
          <Lock className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
          <span className="hidden sm:inline">Lock Portal</span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 relative transition-colors">
          <Bell className="w-4 h-4 text-emerald-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};

