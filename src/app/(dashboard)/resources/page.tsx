'use client';

import React from 'react';
import { Layers, Plus } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Study Resources & Materials</h1>
          <p className="text-xs text-slate-500">
            Repository of learning materials, cheat sheets, and reference guides.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Study Resources Library</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Store cheat sheets, lecture decks, and reference guides linked to your study domains.
        </p>
      </div>
    </div>
  );
}
