'use client';

import React, { useEffect } from 'react';
import { Plus, Search, FolderPlus } from 'lucide-react';
import { useCategoryStore } from '@/lib/store/category-store';
import { CategoryTreeItem } from './CategoryTreeItem';

export const CategoryTree: React.FC = () => {
  const { tree, categories, searchQuery, setSearchQuery, openCreateModal, loadCategories } =
    useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filter tree based on search query if present
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
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Study Topics & Domains
        </span>
        <button
          onClick={() => openCreateModal(null)}
          title="Add Root Category"
          className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1 text-[11px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Categories Tree */}
      <div className="space-y-0.5 max-h-[360px] overflow-y-auto pr-1">
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
            <p className="px-3 py-2 text-xs text-slate-500 italic">No categories found</p>
          )
        ) : tree.length > 0 ? (
          tree.map((node) => <CategoryTreeItem key={node.id} node={node} depth={0} />)
        ) : (
          <div className="p-3 text-center rounded-xl bg-slate-900/50 border border-slate-800">
            <p className="text-xs text-slate-400 mb-2">No categories created yet</p>
            <button
              onClick={() => openCreateModal(null)}
              className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 text-white hover:bg-indigo-500 inline-flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Create First Category</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
