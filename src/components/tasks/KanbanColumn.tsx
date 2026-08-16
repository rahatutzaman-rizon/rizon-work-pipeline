'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { useTaskStore } from '@/lib/store/task-store';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  accentColor: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, accentColor }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { openCreateTaskModal } = useTaskStore();

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-3xl glass-panel p-4 border transition-all duration-200 min-h-[500px] ${
        isOver
          ? 'border-indigo-500/80 bg-indigo-950/20 shadow-xl shadow-indigo-500/10'
          : 'border-slate-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
          <h3 className="text-xs font-bold text-white tracking-wide uppercase">{title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={openCreateTaskModal}
          title="Add task to column"
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sortable Task List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="h-32 border-2 border-dashed border-slate-800/80 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
              <p className="text-[11px] text-slate-500 font-medium">No tasks in {title}</p>
              <button
                onClick={openCreateTaskModal}
                className="mt-2 text-[10px] text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
