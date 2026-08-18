'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  FileText,
  Bookmark,
  Sparkles,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  Layers,
  GraduationCap,
  FileCheck2,
  Menu,
  X,
  Database,
  Cloud,
  Landmark,
  Building2,
  Terminal,
  Languages,
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
        className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold tracking-wider text-emerald-700 uppercase hover:text-emerald-900 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-emerald-600" />
        ) : (
          <ChevronRight className="w-3 h-3 text-emerald-600" />
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
  badgeColor?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, badge, badgeColor, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
        isActive
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
          : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={isActive ? 'text-white' : 'text-emerald-600'}>{icon}</span>
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            isActive
              ? 'bg-emerald-700 text-white font-bold'
              : badgeColor || 'bg-emerald-100 text-emerald-800 font-semibold'
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="w-72 h-full flex flex-col justify-between select-none bg-white">
      {/* Top Brand Logo */}
      <div className="p-4 border-b border-emerald-100/70 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 flex items-center justify-between">
        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-lime-500 flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900">
              RIZON <span className="text-emerald-600 font-bold text-xs">Knowledge Portal</span>
            </h1>
            <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Bangladesh Exam Portal</span>
            </p>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Scroll Area - ALL Subjects Visible */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Core Navigation */}
        <div className="space-y-0.5">
          <NavItem href="/dashboard" onClick={() => setMobileOpen(false)} icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard & Routine" />
          <NavItem
            href="/calendar"
            onClick={() => setMobileOpen(false)}
            icon={<Calendar className="w-4 h-4" />}
            label="Exam Schedule & Notices"
            badge="47th BCS"
            badgeColor="bg-amber-100 text-amber-800"
          />
        </div>

        {/* 4 TOP-LEVEL TARGET MODULES */}
        <NavGroup title="4 Primary Study Modules">
          <NavItem
            href="/bcs"
            onClick={() => setMobileOpen(false)}
            icon={<Landmark className="w-4 h-4 text-emerald-600" />}
            label="1. BCS Preliminary Hub"
            badge="BCS Exam"
            badgeColor="bg-emerald-600 text-white font-bold"
          />
          <NavItem
            href="/bank-it"
            onClick={() => setMobileOpen(false)}
            icon={<Building2 className="w-4 h-4 text-teal-600" />}
            label="2. Bank IT Officer Jobs"
            badge="Bank Exam"
            badgeColor="bg-teal-600 text-white font-bold"
          />
          <NavItem
            href="/software-ai"
            onClick={() => setMobileOpen(false)}
            icon={<Terminal className="w-4 h-4 text-sky-600" />}
            label="3. Software & AI Eng."
            badge="Tech Exam"
            badgeColor="bg-sky-600 text-white font-bold"
          />
          <NavItem
            href="/languages"
            onClick={() => setMobileOpen(false)}
            icon={<Languages className="w-4 h-4 text-lime-600" />}
            label="4. Spoken English & Spanish"
            badge="Lang Exam"
            badgeColor="bg-lime-700 text-white font-bold"
          />
        </NavGroup>

        {/* Collapsible Subject Syllabus Tree (Default Collapsed for Low Clutter) */}
        <NavGroup title="13 BPSC Core Subjects" defaultOpen={false}>
          <div className="py-1">
            <CategoryTree />
          </div>
        </NavGroup>

        {/* Collapsible Study Tools Section */}
        <NavGroup title="Notes & Study Tools" defaultOpen={false}>
          <NavItem
            href="/notes"
            onClick={() => setMobileOpen(false)}
            icon={<BookOpen className="w-4 h-4" />}
            label="Bangla Notes & Editor"
          />
          <NavItem href="/documents" onClick={() => setMobileOpen(false)} icon={<FileText className="w-4 h-4" />} label="PDF Reader & Circulars" />
          <NavItem href="/resources" onClick={() => setMobileOpen(false)} icon={<Layers className="w-4 h-4 text-emerald-600" />} label="Syllabus & Formula Bank" />
          <NavItem
            href="/agents/chat"
            onClick={() => setMobileOpen(false)}
            icon={<Sparkles className="w-4 h-4 text-emerald-600" />}
            label="AI Note Generator"
          />
        </NavGroup>

        {/* System Settings & Analytics */}
        <div className="pt-2 border-t border-emerald-100 space-y-0.5">
          <NavItem href="/analytics" onClick={() => setMobileOpen(false)} icon={<BarChart3 className="w-4 h-4" />} label="Study Progress" />
          <NavItem href="/settings" onClick={() => setMobileOpen(false)} icon={<Settings className="w-4 h-4" />} label="Settings & Fonts" />
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-emerald-100 bg-emerald-50/40">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              BCS
            </div>
            <div className="text-left truncate">
              <p className="text-xs font-bold text-slate-800 truncate">Candidate Portal</p>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-500" />
                <span>Supabase Live DB</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar Bar (Visible on screens < md) */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-emerald-100 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
            BCS
          </div>
          <span className="font-extrabold text-sm text-slate-900">RIZON BCS Exam Portal</span>
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-200"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-emerald-700" />
        </button>
      </div>

      {/* Mobile Slide-Out Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />
          {/* Drawer Content */}
          <div className="relative z-10 w-72 max-w-full h-full bg-white shadow-2xl animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar (Visible on screens >= md) */}
      <aside className="hidden md:flex w-72 h-screen border-r border-emerald-100 select-none shrink-0 sticky top-0 z-30 bg-white shadow-xs">
        {sidebarContent}
      </aside>
    </>
  );
};
