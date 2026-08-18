'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Edit2, Trash2, CheckSquare } from 'lucide-react';
import { taskFormSchema, TaskFormValues } from '@/lib/validations/task';
import { useTaskStore } from '@/lib/store/task-store';
import { useCategoryStore } from '@/lib/store/category-store';
import { createTask, updateTask } from '@/lib/supabase/tasks-db';
import { BanglaInput } from '../common/BanglaInput';

export const TaskModal: React.FC = () => {
  const { isModalOpen, modalMode, taskToEdit, closeTaskModal, loadTasks } = useTaskStore();
  const { categories } = useCategoryStore();

  const [checklistItems, setChecklistItems] = useState<Array<{ id?: string; title: string; is_completed: boolean }>>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      category_id: null,
      due_date: '',
      estimated_minutes: 30,
    },
  });

  const titleValue = watch('title');
  const descriptionValue = watch('description');

  useEffect(() => {
    if (isModalOpen) {
      if (modalMode === 'edit' && taskToEdit) {
        reset({
          title: taskToEdit.title,
          description: taskToEdit.description || '',
          status: taskToEdit.status,
          priority: taskToEdit.priority,
          category_id: taskToEdit.category_id,
          due_date: taskToEdit.due_date ? taskToEdit.due_date.split('T')[0] : '',
          estimated_minutes: taskToEdit.estimated_minutes || 30,
        });
        setChecklistItems(taskToEdit.checklists || []);
      } else {
        reset({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          category_id: null,
          due_date: '',
          estimated_minutes: 30,
        });
        setChecklistItems([]);
      }
    }
  }, [isModalOpen, modalMode, taskToEdit, reset]);

  if (!isModalOpen) return null;

  const addChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklistItems([
      ...checklistItems,
      { id: `temp-${Date.now()}`, title: newChecklistText.trim(), is_completed: false },
    ]);
    setNewChecklistText('');
  };

  const removeChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const toggleChecklistItem = (index: number) => {
    const updated = [...checklistItems];
    updated[index].is_completed = !updated[index].is_completed;
    setChecklistItems(updated);
  };

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const payload = {
        ...data,
        checklists: checklistItems,
      };

      if (modalMode === 'edit' && taskToEdit) {
        await updateTask(taskToEdit.id, payload as any);
      } else {
        await createTask(payload as any);
      }
      await loadTasks();
      closeTaskModal();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl p-6 text-slate-900 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {modalMode === 'edit' ? 'Edit Task' : 'Create Task'}
              </h3>
              <p className="text-xs text-slate-500">
                Assign priorities, due dates, checklists & link to a Study Domain
              </p>
            </div>
          </div>
          <button
            onClick={closeTaskModal}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Title with Bangla Phonetic Support */}
          <BanglaInput
            label="Task Title"
            required
            value={titleValue || ''}
            onChange={(val) => setValue('title', val, { shouldValidate: true })}
            placeholder="e.g. Master RAG Vector Indexing, Practice Spanish Verbs"
          />
          {errors.title && <p className="text-xs text-rose-500">{errors.title.message}</p>}

          {/* Description with Bangla Phonetic Support & Formatting Controls */}
          <BanglaInput
            label="Description & Notes (Optional)"
            isTextarea
            rows={2}
            value={descriptionValue || ''}
            onChange={(val) => setValue('description', val)}
            placeholder="Detailed instructions or study notes..."
          />

          {/* Grid: Domain Linkage, Status, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category / Study Domain */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Study Domain
              </label>
              <select
                {...register('category_id')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
              >
                <option value="">No Domain (General)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent 🔥</option>
              </select>
            </div>
          </div>

          {/* Grid: Due Date & Estimated Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                {...register('due_date')}
                type="date"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Time (Minutes)
              </label>
              <input
                {...register('estimated_minutes', { valueAsNumber: true })}
                type="number"
                step={5}
                min={5}
                max={480}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Sub-task Checklist Section */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Sub-task Checklist ({checklistItems.filter((c) => c.is_completed).length}/{checklistItems.length})
            </label>

            {/* Checklist items list */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.is_completed}
                      onChange={() => toggleChecklistItem(idx)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span
                      className={`truncate ${
                        item.is_completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
                      }`}
                    >
                      {item.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add checklist item row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a sub-task item..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addChecklistItem();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
              />
              <button
                type="button"
                onClick={addChecklistItem}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
                  <Plus className="w-4 h-4" /> Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
