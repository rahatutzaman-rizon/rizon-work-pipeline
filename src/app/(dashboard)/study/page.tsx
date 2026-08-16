'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Layers, Plus, ArrowRight, FolderPlus } from 'lucide-react';
import { useCategoryStore } from '@/lib/store/category-store';
import { DynamicIcon } from '@/components/common/IconPicker';

export default function StudyRootPage() {
  const { tree, openCreateModal, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Study Domains & Topics</h1>
          <p className="text-xs text-slate-400">
            Browse all top-level study domains and their nested sub-categories.
          </p>
        </div>
        <button
          onClick={() => openCreateModal(null)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tree.map((node) => (
          <div
            key={node.id}
            className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-2xl text-white flex items-center justify-center shadow-lg"
                style={{ backgroundColor: node.color || '#6366f1' }}
              >
                <DynamicIcon name={node.icon || 'Folder'} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{node.name}</h3>
                <p className="text-xs text-slate-400">
                  {node.children ? node.children.length : 0} sub-categories
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2">
              {node.description || 'General study domain and topic collection.'}
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Created {new Date(node.created_at).toLocaleDateString()}
              </span>
              <Link
                href={`/study/${node.slug}`}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>View Domain</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
