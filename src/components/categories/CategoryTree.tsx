'use client';

import React, { useEffect, useState } from 'react';
import { Plus, FolderPlus, RefreshCw, BookOpen } from 'lucide-react';
import { useCategoryStore } from '@/lib/store/category-store';
import { seedSupabaseCategories } from '@/lib/supabase/db';
import { CategoryTreeItem } from './CategoryTreeItem';

export const CategoryTree: React.FC = () => {
  const { tree, categories, searchQuery, openCreateModal, loadCategories, toggleExpand, expandedIds } =
    useCategoryStore();
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (tree.length > 0 && expandedIds.size === 0) {
      tree.forEach((node) => {
        if (node.children && node.children.length > 0) {
          toggleExpand(node.id);
        }
      });
    }
  }, [tree]);

  const handleSeed = async () => {
    setIsSeeding(true);
    await seedSupabaseCategories();
    await loadCategories();
    setIsSeeding(false);
  };

  const filteredCategories = searchQuery
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="space-y-2">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between px-2.5 py-1">
        <span className="text-[11px] font-extrabold tracking-wider text-emerald-800 uppercase flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-emerald-600" />
          <span>Exam Subjects ({categories.length})</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            title="Sync Default Subjects to Database"
            className="p-1 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors text-[11px]"
          >
            <RefreshCw className={`w-3 h-3 ${isSeeding ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => openCreateModal(null)}
            title="Add New Subject"
            className="p-1 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/70 rounded-md transition-colors flex items-center gap-1 text-[11px] font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="space-y-0.5 pr-1">
        {filteredCategories ? (
          filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <CategoryTreeItem
                key={cat.id}
                node={{ ...cat, children: [] }}
                depth={0}
              />
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-slate-400 italic">No subjects found</p>
          )
        ) : tree.length > 0 ? (
          tree.map((node) => <CategoryTreeItem key={node.id} node={node} depth={0} />)
        ) : (
          <div className="p-3 text-center rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <p className="text-xs text-emerald-800 font-medium">No exam subjects loaded</p>
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="px-3 py-1.5 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700 font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>{isSeeding ? 'Syncing...' : 'Load Default BCS Subjects'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

