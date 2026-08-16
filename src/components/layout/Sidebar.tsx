'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  GitMerge,
  BookOpen,
  FileText,
  FileSearch,
  Bookmark,
  Sparkles,
  Bot,
  FileCode,
  BrainCircuit,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  Layers,
  Zap,
} from 'lucide-react';
import { CategoryTree } from '../categories/CategoryTree';

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const NavGroup: React.FC<NavGroupProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1 py-1.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase hover:text-slate-200 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-slate-500" />
        )}
      </button>
      {isOpen && <div className="space-y-0.5">{children}</div>}
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, badge }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
        isActive
          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={isActive ? 'text-white' : 'text-slate-400'}>{icon}</span>
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            isActive ? 'bg-indigo-900/60 text-indigo-100' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 h-screen glass-sidebar border-r border-slate-800/80 flex flex-col justify-between select-none shrink-0 sticky top-0 z-30">
      {/* Top Brand Logo */}
      <div className="p-4 border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              RIZON
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Knowledge & AI Workspace</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Core Navigation */}
        <div className="space-y-0.5">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
        </div>

        {/* My Workspace Section */}
        <NavGroup title="My Workspace">
          <NavItem href="/tasks" icon={<CheckSquare className="w-4 h-4" />} label="Tasks" badge={12} />
          <NavItem href="/calendar" icon={<Calendar className="w-4 h-4" />} label="Calendar" />
          <NavItem href="/pipeline" icon={<GitMerge className="w-4 h-4" />} label="Pipeline" />
        </NavGroup>

        {/* Study Section (With Dynamic Recursive Category Tree!) */}
        <div className="py-1">
          <CategoryTree />
        </div>

        {/* Knowledge Section */}
        <NavGroup title="Knowledge">
          <NavItem href="/notes" icon={<BookOpen className="w-4 h-4" />} label="Notes" badge={24} />
          <NavItem href="/documents" icon={<FileText className="w-4 h-4" />} label="Documents" badge={8} />
          <NavItem href="/bookmarks" icon={<Bookmark className="w-4 h-4" />} label="Bookmarks" />
          <NavItem href="/resources" icon={<Layers className="w-4 h-4" />} label="Resources" />
        </NavGroup>

        {/* AI Section */}
        <NavGroup title="AI Workspace">
          <NavItem href="/agents/chat" icon={<Sparkles className="w-4 h-4 text-indigo-400" />} label="AI Assistant" />
          <NavItem href="/agents/pdf" icon={<FileSearch className="w-4 h-4 text-emerald-400" />} label="PDF Summarizer" />
          <NavItem href="/agents/planner" icon={<Zap className="w-4 h-4 text-amber-400" />} label="Study Planner" />
          <NavItem href="/agents/research" icon={<Bot className="w-4 h-4 text-violet-400" />} label="Research Agent" />
        </NavGroup>

        {/* Analytics & System Settings */}
        <div className="pt-2 border-t border-slate-800/80 space-y-0.5">
          <NavItem href="/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
          <NavItem href="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
              RZ
            </div>
            <div className="text-left truncate">
              <p className="text-xs font-semibold text-white truncate">Rizon Workspace</p>
              <p className="text-[10px] text-emerald-400 font-medium">Pro Plan · Active</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
