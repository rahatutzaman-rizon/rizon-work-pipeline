'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Edit2, FolderPlus } from 'lucide-react';
import { categoryFormSchema, CategoryFormValues } from '@/lib/validations/category';
import { useCategoryStore } from '@/lib/store/category-store';
import { createCategory, updateCategory } from '@/lib/supabase/db';
import { IconPicker, DynamicIcon } from '../common/IconPicker';

const COLOR_PRESETS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#f43f5e', // Rose
  '#64748b', // Slate
];

export const CategoryModal: React.FC = () => {
  const {
    isModalOpen,
    modalMode,
    modalParentId,
    categoryToEdit,
    categories,
    closeModal,
    loadCategories,
  } = useCategoryStore();

  const parentCategory = categories.find((c) => c.id === modalParentId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      parent_id: modalParentId || null,
      icon: 'Folder',
      color: '#6366f1',
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  useEffect(() => {
    if (isModalOpen) {
      if (modalMode === 'edit' && categoryToEdit) {
        reset({
          name: categoryToEdit.name,
          description: categoryToEdit.description || '',
          parent_id: categoryToEdit.parent_id,
          icon: categoryToEdit.icon || 'Folder',
          color: categoryToEdit.color || '#6366f1',
        });
      } else {
        reset({
          name: '',
          description: '',
          parent_id: modalParentId || null,
          icon: 'Folder',
          color: '#6366f1',
        });
      }
    }
  }, [isModalOpen, modalMode, categoryToEdit, modalParentId, reset]);

  if (!isModalOpen) return null;

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (modalMode === 'edit' && categoryToEdit) {
        await updateCategory(categoryToEdit.id, data);
      } else {
        await createCategory(data);
      }
      await loadCategories();
      closeModal();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-modal rounded-2xl p-6 text-white shadow-2xl border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl text-white flex items-center justify-center shadow-lg"
              style={{ backgroundColor: selectedColor }}
            >
              <DynamicIcon name={selectedIcon} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {modalMode === 'edit' ? 'Edit Category' : 'Create Category'}
              </h3>
              <p className="text-xs text-slate-400">
                {parentCategory
                  ? `Sub-category under "${parentCategory.name}"`
                  : 'Root Category (Top Level)'}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Category Name <span className="text-rose-400">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. System Design, RAG, Vocabulary"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Brief description of this study or knowledge domain..."
              className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Parent Category Selector (Supports changing hierarchy!) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Parent Category (Nesting)
            </label>
            <select
              {...register('parent_id')}
              className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            >
              <option value="">None (Top-Level Category)</option>
              {categories
                .filter((c) => c.id !== categoryToEdit?.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {COLOR_PRESETS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setValue('color', col)}
                  className={`w-7 h-7 rounded-lg transition-transform ${
                    selectedColor === col
                      ? 'scale-110 ring-2 ring-white shadow-md'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Icon
            </label>
            <IconPicker
              selectedIcon={selectedIcon}
              onSelect={(iconName) => setValue('icon', iconName)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {modalMode === 'edit' ? (
                <>
                  <Edit2 className="w-4 h-4" /> Save Changes
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
