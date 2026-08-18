'use client';

import React from 'react';
import { Clock, CheckSquare, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Task, TaskPriority } from '@/types';
import { useTaskStore } from '@/lib/store/task-store';
import { useCategoryStore } from '@/lib/store/category-store';

interface TaskListViewProps {
  tasks: Task[];
}

const PRIORITY_BADGES: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600 border border-slate-200',
  medium: 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold',
  high: 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
  urgent: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold',
};

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks }) => {
  const { moveTask, openEditTaskModal, removeTask } = useTaskStore();
  const { categories } = useCategoryStore();

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <p className="text-xs text-slate-500 font-medium">No tasks found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4 w-10">Status</th>
              <th className="py-3.5 px-4">Task Title</th>
              <th className="py-3.5 px-4">Study Domain</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Sub-tasks</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const category = categories.find((c) => c.id === task.category_id);
              const isDone = task.status === 'done';
              const totalChecklist = task.checklists ? task.checklists.length : 0;
              const completedChecklist = task.checklists
                ? task.checklists.filter((c) => c.is_completed).length
                : 0;

              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Status Checkbox */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => moveTask(task.id, isDone ? 'todo' : 'done')}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <p
                        className={`font-bold text-slate-900 ${
                          isDone ? 'line-through text-slate-400 font-normal' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Domain Category */}
                  <td className="py-3.5 px-4">
                    {category ? (
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white inline-block shadow-xs"
                        style={{ backgroundColor: category.color || '#4f46e5' }}
                      >
                        {category.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">General</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] capitalize ${
                        PRIORITY_BADGES[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Checklist */}
                  <td className="py-3.5 px-4">
                    {totalChecklist > 0 ? (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600 font-semibold">
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>
                          {completedChecklist}/{totalChecklist}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4">
                    {task.due_date ? (
                      <span className="flex items-center gap-1 text-slate-600 text-[11px] font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditTaskModal(task)}
                        title="Edit Task"
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeTask(task.id)}
                        title="Delete Task"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
