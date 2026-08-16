'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Sparkles, Plus, Command, Home, ChevronRight } from 'lucide-react';
import { useCategoryStore } from '@/lib/store/category-store';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { openCreateModal } = useCategoryStore();

  // Generate breadcrumb links from path
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <header className="h-16 glass-panel sticky top-0 z-20 px-6 flex items-center justify-between border-b border-slate-800/80">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Home className="w-4 h-4 text-slate-500" />
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="capitalize font-medium text-slate-300">
          {pathSegments[0] || 'Dashboard'}
        </span>
        {pathSegments.slice(1).map((seg, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="capitalize text-indigo-300 font-semibold">{seg.replace(/-/g, ' ')}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Right: Quick Search, Actions, Notifications */}
      <div className="flex items-center gap-3">
        {/* Search Bar Trigger */}
        <div className="relative hidden md:block">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 w-64 hover:border-slate-700 cursor-pointer transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search topics, notes, tasks...</span>
            <kbd className="ml-auto px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </div>

        {/* AI Quick Button */}
        <button className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/40 text-violet-200 hover:text-white text-xs font-medium flex items-center gap-1.5 hover:border-violet-500/60 transition-all shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          <span className="hidden sm:inline">Ask AI Agent</span>
        </button>

        {/* Quick Category Add Button */}
        <button
          onClick={() => openCreateModal(null)}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Domain</span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
        </button>
      </div>
    </header>
  );
};
