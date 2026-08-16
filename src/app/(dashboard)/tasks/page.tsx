'use client';

import React from 'react';
import { CheckSquare, Sparkles, Plus, Clock } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Task Management</h1>
          <p className="text-xs text-slate-400">
            Phase 2 target: Kanban drag-and-drop board, checklists, priorities & study topic linking.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Scheduled for Phase 2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['To Do', 'In Progress', 'Completed'].map((status, idx) => (
          <div key={status} className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>{status}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">{idx * 2 + 1}</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <p className="font-semibold text-slate-200">Implement RAG Vector Store</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-indigo-400">AI Domain</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Today</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
