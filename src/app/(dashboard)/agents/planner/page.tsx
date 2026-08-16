'use client';

import React from 'react';
import { Zap, Sparkles, Bot, Clock } from 'lucide-react';

export default function PlannerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Study Planner</h1>
          <p className="text-xs text-slate-400">
            Phase 7 target: "I have 2 hours today" → automatically generates a targeted study plan.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Scheduled for Phase 7</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Smart Time Allocator</h3>
            <p className="text-xs text-slate-400">Input your available time to receive instant schedule breakdown</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="text"
            placeholder='e.g. "I have 2 hours today and want to focus on RAG & Spanish"'
            disabled
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed opacity-75"
          />
          <button disabled className="px-4 py-3 bg-indigo-600/50 text-white rounded-xl text-xs font-semibold cursor-not-allowed">
            Generate Plan
          </button>
        </div>
      </div>
    </div>
  );
}
