'use client';

import React, { use, useEffect } from 'react';
import Link from 'next/link';
import {
  Folder,
  Plus,
  ArrowLeft,
  BookOpen,
  CheckSquare,
  FileText,
  Bot,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import { useCategoryStore } from '@/lib/store/category-store';
import { useTaskStore } from '@/lib/store/task-store';
import { DynamicIcon } from '@/components/common/IconPicker';
import { deleteCategory } from '@/lib/supabase/db';

export default function StudyCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.category;

  const { categories, openCreateModal, openEditModal, loadCategories } = useCategoryStore();
  const { tasks, loadTasks, moveTask, openCreateTaskModal } = useTaskStore();

  useEffect(() => {
    loadCategories();
    loadTasks();
  }, [loadCategories, loadTasks]);

  const currentCategory = categories.find((c) => c.slug === slug);
  const subCategories = categories.filter((c) => c?.parent_id === currentCategory?.id);
  const parentCategory = currentCategory?.parent_id
    ? categories.find((c) => c.id === currentCategory.parent_id)
    : null;

  if (!currentCategory) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Domain Not Found</h2>
        <p className="text-sm text-slate-400">The study domain "{slug}" does not exist yet.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  // Linked tasks for this domain
  const domainTasks = tasks.filter((t) => t.category_id === currentCategory.id);
  const totalDomainTasks = domainTasks.length;
  const completedDomainTasks = domainTasks.filter((t) => t.status === 'done').length;
  const progressPercent =
    totalDomainTasks > 0 ? Math.round((completedDomainTasks / totalDomainTasks) * 100) : 0;

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${currentCategory.name}"?`)) {
      await deleteCategory(currentCategory.id);
      await loadCategories();
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(currentCategory)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Category</span>
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-900/50 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Category Header Hero */}
      <div className="rounded-3xl glass-panel p-8 border border-slate-800 relative overflow-hidden space-y-6">
        <div
          className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentCategory.color || '#6366f1' }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-2xl text-white flex items-center justify-center shadow-xl shrink-0"
              style={{ backgroundColor: currentCategory.color || '#6366f1' }}
            >
              <DynamicIcon name={currentCategory.icon || 'Folder'} className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              {parentCategory && (
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                  <Link href={`/study/${parentCategory.slug}`} className="hover:underline">
                    {parentCategory.name}
                  </Link>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Sub-Domain</span>
                </div>
              )}
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {currentCategory.name}
              </h1>
              <p className="text-xs text-slate-400 max-w-xl">
                {currentCategory.description ||
                  'Centralized domain view aggregating tasks, notes, documents, and AI agent history.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => openCreateModal(currentCategory.id)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sub-category</span>
          </button>
        </div>

        {/* Progress Gauge Rollup */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium uppercase">Domain Task Progress</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-bold text-white">{progressPercent}%</span>
              <span className="text-xs text-indigo-400">
                {completedDomainTasks} / {totalDomainTasks} tasks done
              </span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium uppercase">Linked Notes</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-bold text-white">6 Notes</span>
              <span className="text-xs text-cyan-400">Tiptap ready</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium uppercase">Documents</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-bold text-white">3 Files</span>
              <span className="text-xs text-emerald-400">PDFs uploaded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Domain Tasks ({totalDomainTasks})</h2>
          </div>
          <button
            onClick={openCreateTaskModal}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task to {currentCategory.name}</span>
          </button>
        </div>

        {domainTasks.length > 0 ? (
          <div className="rounded-2xl glass-panel border border-slate-800 divide-y divide-slate-800/80">
            {domainTasks.map((task) => {
              const isDone = task.status === 'done';
              return (
                <div
                  key={task.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => moveTask(task.id, isDone ? 'todo' : 'done')}
                      className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold text-white truncate ${
                          isDone ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 truncate max-w-md">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold bg-slate-800 text-slate-400">
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <p className="text-xs text-slate-400">
              No tasks currently assigned to "{currentCategory.name}".
            </p>
            <button
              onClick={openCreateTaskModal}
              className="text-xs text-indigo-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create first task for this domain</span>
            </button>
          </div>
        )}
      </div>

      {/* Nested Sub-Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Sub-Categories & Topics ({subCategories.length})</h2>
          <button
            onClick={() => openCreateModal(currentCategory.id)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sub-category</span>
          </button>
        </div>

        {subCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/study/${sub.slug}`}
                className="p-5 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-2 block group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="p-2 rounded-xl text-white flex items-center justify-center shadow-md"
                      style={{ backgroundColor: sub.color || '#6366f1' }}
                    >
                      <DynamicIcon name={sub.icon || 'Folder'} className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {sub.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {sub.description || 'Nested topic under ' + currentCategory.name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <p className="text-xs text-slate-400">
              No sub-categories created under "{currentCategory.name}" yet.
            </p>
            <button
              onClick={() => openCreateModal(currentCategory.id)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Sub-category</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
