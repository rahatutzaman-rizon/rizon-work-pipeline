'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  FolderPlus,
  Sparkles,
  BookOpen,
  CheckSquare,
  FileText,
  Bot,
  ArrowRight,
  TrendingUp,
  Plus,
  Edit2,
  Clock,
  Layers,
} from 'lucide-react';
import { useCategoryStore } from '@/lib/store/category-store';
import { DynamicIcon } from '@/components/common/IconPicker';

export default function DashboardPage() {
  const { tree, categories, openCreateModal, openEditModal, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-slate-900/60 p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 1 — Foundation & Knowledge Graph Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back to <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">Rizon Workspace</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your personal unified study, knowledge, and task platform. All topics, notes, and AI agent history are interconnected via your central study topic graph.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openCreateModal(null)}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Category</span>
            </button>
            <Link
              href="/agents/planner"
              className="px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-violet-400" />
              <span>Study Planner</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Categories</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{categories.length}</span>
            <span className="text-xs text-indigo-400 font-medium">Nested tree ready</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Tasks</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">12</span>
            <span className="text-xs text-emerald-400 font-medium">3 completed today</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Knowledge Notes</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">24</span>
            <span className="text-xs text-cyan-400 font-medium">Linked to topics</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Daily Study Target</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">1.5 / 2.0h</span>
            <span className="text-xs text-amber-400 font-medium">75% achieved</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Study Topics & Domains */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Study Topics & Categories</h2>
            <p className="text-xs text-slate-400">
              Hierarchical knowledge domains with unlimited parent-child nesting support.
            </p>
          </div>
          <button
            onClick={() => openCreateModal(null)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add Root Domain</span>
          </button>
        </div>

        {/* Categories Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tree.map((node) => {
            const childrenCount = node.children ? node.children.length : 0;
            return (
              <div
                key={node.id}
                className="group relative rounded-2xl glass-panel glass-panel-hover p-6 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                {/* Card Top Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-2xl text-white flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: node.color || '#6366f1' }}
                    >
                      <DynamicIcon name={node.icon || 'Folder'} className="w-5 h-5" />
                    </div>
                    <div>
                      <Link href={`/study/${node.slug}`}>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {node.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-400">
                        {childrenCount} sub-{childrenCount === 1 ? 'category' : 'categories'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openCreateModal(node.id)}
                      title="Add Sub-category"
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(node)}
                      title="Edit Category"
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">
                  {node.description || 'No description provided for this study category.'}
                </p>

                {/* Sub-categories Preview Badges */}
                {childrenCount > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                      Nested Domains
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {node.children.slice(0, 3).map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/study/${sub.slug}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: sub.color || '#6366f1' }}
                          />
                          <span>{sub.name}</span>
                        </Link>
                      ))}
                      {childrenCount > 3 && (
                        <span className="px-2 py-1 rounded-lg bg-slate-900 text-[10px] text-slate-500">
                          +{childrenCount - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Footer Link */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Progress</span>
                  <Link
                    href={`/study/${node.slug}`}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Open Domain</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
