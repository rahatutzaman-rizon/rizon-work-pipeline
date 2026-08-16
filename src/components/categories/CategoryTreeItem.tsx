'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown, Plus, Edit2, Trash2, Folder } from 'lucide-react';
import { CategoryNode } from '@/types';
import { useCategoryStore } from '@/lib/store/category-store';
import { deleteCategory } from '@/lib/supabase/db';
import { DynamicIcon } from '../common/IconPicker';

interface CategoryTreeItemProps {
  node: CategoryNode;
  depth?: number;
}

export const CategoryTreeItem: React.FC<CategoryTreeItemProps> = ({ node, depth = 0 }) => {
  const pathname = usePathname();
  const { expandedIds, toggleExpand, openCreateModal, openEditModal, loadCategories } =
    useCategoryStore();

  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const href = `/study/${node.slug}`;
  const isActive = pathname === href;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      confirm(
        `Are you sure you want to delete "${node.name}"${
          hasChildren ? ' and all its sub-categories?' : '?'
        }`
      )
    ) {
      await deleteCategory(node.id);
      await loadCategories();
    }
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCreateModal(node.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openEditModal(node);
  };

  return (
    <div className="select-none">
      <div
        className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all duration-150 ${
          isActive
            ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
        }`}
        style={{ paddingLeft: `${depth * 14 + 10}px` }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Expand/Collapse Caret */}
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.id)}
              className="p-0.5 text-slate-400 hover:text-white rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-3.5 h-3.5 inline-block opacity-0" />
          )}

          {/* Icon Link */}
          <Link href={href} className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className="p-1 rounded-md text-white flex items-center justify-center shadow-xs shrink-0"
              style={{ backgroundColor: node.color || '#6366f1' }}
            >
              <DynamicIcon name={node.icon || 'Folder'} className="w-3.5 h-3.5" />
            </span>
            <span className="truncate text-xs">{node.name}</span>
          </Link>
        </div>

        {/* Hover Actions */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <button
            onClick={handleAddChild}
            title="Add Sub-category"
            className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 rounded transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={handleEdit}
            title="Edit Category"
            className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded transition-colors"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            title="Delete Category"
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Recursive Children */}
      {hasChildren && isExpanded && (
        <div className="mt-0.5 space-y-0.5 border-l border-slate-800/80 ml-4">
          {node.children.map((child) => (
            <CategoryTreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
