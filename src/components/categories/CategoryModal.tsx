'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Edit2 } from 'lucide-react';
import { categoryFormSchema, CategoryFormValues } from '@/lib/validations/category';
import { useCategoryStore } from '@/lib/store/category-store';
import { createCategory, updateCategory } from '@/lib/supabase/db';
import { IconPicker, DynamicIcon } from '../common/IconPicker';
import { BanglaInput } from '../common/BanglaInput';

const COLOR_PRESETS = [
  '#4f46e5', // Indigo
  '#7c3aed', // Violet
  '#ec4899', // Pink
  '#0284c7', // Sky
  '#059669', // Emerald
  '#d97706', // Amber
  '#2563eb', // Blue
  '#e11d48', // Rose
  '#475569', // Slate
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
      color: '#4f46e5',
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');
  const nameValue = watch('name');
  const descriptionValue = watch('description');

  useEffect(() => {
    if (isModalOpen) {
      if (modalMode === 'edit' && categoryToEdit) {
        reset({
          name: categoryToEdit.name,
          description: categoryToEdit.description || '',
          parent_id: categoryToEdit.parent_id,
          icon: categoryToEdit.icon || 'Folder',
          color: categoryToEdit.color || '#4f46e5',
        });
      } else {
        reset({
          name: '',
          description: '',
          parent_id: modalParentId || null,
          icon: 'Folder',
          color: '#4f46e5',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 text-slate-900 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl text-white flex items-center justify-center shadow-md"
              style={{ backgroundColor: selectedColor }}
            >
              <DynamicIcon name={selectedIcon} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {modalMode === 'edit' ? 'Edit Study Domain' : 'Create Study Domain'}
              </h3>
              <p className="text-xs text-slate-500">
                {parentCategory
                  ? `Sub-category under "${parentCategory.name}"`
                  : 'Root Category Domain'}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Name with Bangla Phonetic Support */}
          <BanglaInput
            label="Domain Name"
            required
            value={nameValue || ''}
            onChange={(val) => setValue('name', val, { shouldValidate: true })}
            placeholder="e.g. System Design, RAG Architecture, BCS Prep"
          />
          {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}

          {/* Description with Bangla Phonetic Support */}
          <BanglaInput
            label="Description (Optional)"
            isTextarea
            rows={2}
            value={descriptionValue || ''}
            onChange={(val) => setValue('description', val)}
            placeholder="Brief overview of this study domain..."
          />

          {/* Parent Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Parent Domain (Nesting)
            </label>
            <select
              {...register('parent_id')}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
            >
              <option value="">None (Top-Level Domain)</option>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                      ? 'scale-110 ring-2 ring-indigo-500 ring-offset-2 shadow-sm'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Domain Icon
            </label>
            <IconPicker
              selectedIcon={selectedIcon}
              onSelect={(iconName) => setValue('icon', iconName)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {modalMode === 'edit' ? (
                <>
                  <Edit2 className="w-4 h-4" /> Save Changes
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Domain
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
