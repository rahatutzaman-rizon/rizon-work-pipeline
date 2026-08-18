'use client';

import React, { useEffect } from 'react';
import {
  X,
  CheckSquare,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';
import { TaskItem, updateTaskStatus, deleteTask } from '@/lib/supabase/modules-db';
import { CommentThread } from '../comments/CommentThread';

interface TaskDetailModalProps {
  task: TaskItem | null;
  onClose: () => void;
  onRefresh?: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onRefresh }) => {
  // Sync URL query param ?task=<id> for deep-linking
  useEffect(() => {
    if (task && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('task', task.id);
      window.history.replaceState({}, '', url.toString());
    }
  }, [task]);

  if (!task) return null;

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('task');
      window.history.replaceState({}, '', url.toString());
    }
    onClose();
  };

  const isDone = task.status === 'done';

  const handleToggleStatus = async () => {
    const nextStatus = isDone ? 'todo' : 'done';
    await updateTaskStatus(task.id, nextStatus);
    if (onRefresh) onRefresh();
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      await deleteTask(task.id);
      if (onRefresh) onRefresh();
      handleClose();
    }
  };

  const priorityColors = {
    high: 'bg-rose-100 text-rose-800 border-rose-200',
    medium: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden flex flex-col animate-slide-in">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${priorityColors[task.priority]}`}>
                Priority: {task.priority}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white uppercase">
                Status: {task.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug break-words">
              {task.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50/50">
          {/* Status Action Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={handleToggleStatus} className="text-slate-500 hover:text-emerald-600 transition-colors">
                {isDone ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-slate-400" />}
              </button>
              <div>
                <p className="text-xs font-black text-slate-900">
                  {isDone ? 'Task Completed' : 'Task In Progress'}
                </p>
                <p className="text-[11px] text-slate-500">Click icon to mark task done/undone</p>
              </div>
            </div>

            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-colors ${
                isDone
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isDone ? 'Reopen Task' : 'Mark Task Completed'}
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-extrabold text-slate-700 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Task Description</span>
            </h4>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 leading-relaxed text-slate-800 text-xs sm:text-sm font-sans whitespace-pre-wrap shadow-xs">
              {task.description || 'No detailed description specified.'}
            </div>
          </div>

          {/* Checklist */}
          {task.checklist && task.checklist.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-extrabold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Action Checklist ({task.checklist.filter((c) => c.done).length} / {task.checklist.length})</span>
              </h4>
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
                {task.checklist.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-3 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className={`w-4 h-4 ${item.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span className={item.done ? 'line-through text-slate-400' : ''}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {task.due_date && (
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 pt-2 border-t border-slate-200">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Due Date: {new Date(task.due_date).toLocaleDateString()}
            </div>
          )}

          {/* Threaded Comments */}
          <CommentThread parentType="task" parentId={task.id} />
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-colors"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
