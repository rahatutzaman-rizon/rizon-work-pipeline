'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, CheckSquare, Edit2, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { Task, TaskPriority } from '@/types';
import { useTaskStore } from '@/lib/store/task-store';
import { useCategoryStore } from '@/lib/store/category-store';

interface TaskCardProps {
  task: Task;
}

const PRIORITY_STYLES: Record<TaskPriority, { label: string; badge: string }> = {
  low: { label: 'Low', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  medium: { label: 'Medium', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  high: { label: 'High', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  urgent: { label: 'Urgent 🔥', badge: 'bg-rose-50 text-rose-700 border-rose-200 font-bold' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { openEditTaskModal, removeTask } = useTaskStore();
  const { categories } = useCategoryStore();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const category = categories.find((c) => c.id === task.category_id);
  const priorityInfo = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

  const totalChecklist = task.checklists ? task.checklists.length : 0;
  const completedChecklist = task.checklists ? task.checklists.filter((c) => c.is_completed).length : 0;

  const isOverdue =
    task.due_date &&
    task.status !== 'done' &&
    new Date(task.due_date).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl p-4 bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3 ${
        isDragging ? 'ring-2 ring-indigo-500 shadow-xl z-50 scale-105 bg-white' : ''
      }`}
    >
      {/* Card Header: Category Badge & Drag Grip */}
      <div className="flex items-center justify-between gap-2">
        {category ? (
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white truncate max-w-[150px] shadow-xs"
            style={{ backgroundColor: category.color || '#4f46e5' }}
          >
            {category.name}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-500 font-medium">
            General
          </span>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditTaskModal(task)}
            title="Edit Task"
            className="p-1 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => removeTask(task.id)}
            title="Delete Task"
            className="p-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity rounded"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <div
            {...attributes}
            {...listeners}
            className="p-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing rounded"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Task Title & Description */}
      <div className="space-y-1">
        <h4 className={`text-xs font-bold text-slate-900 line-clamp-2 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
          {task.title}
        </h4>
        {task.description && (
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Checklist Progress Bar */}
      {totalChecklist > 0 && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <CheckSquare className="w-3 h-3 text-indigo-600" />
              <span>Sub-tasks</span>
            </span>
            <span className="font-mono font-semibold">
              {completedChecklist}/{totalChecklist}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedChecklist / totalChecklist) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Footer: Priority Tag & Due Date */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
        {/* Priority Badge */}
        <span className={`px-2 py-0.5 rounded-md border font-semibold ${priorityInfo.badge}`}>
          {priorityInfo.label}
        </span>

        {/* Due Date Indicator */}
        {task.due_date && (
          <span
            className={`flex items-center gap-1 font-semibold ${
              isOverdue
                ? 'text-rose-600 font-bold animate-pulse'
                : task.status === 'done'
                ? 'text-slate-400'
                : 'text-slate-500'
            }`}
          >
            {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            <span>
              {new Date(task.due_date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};
