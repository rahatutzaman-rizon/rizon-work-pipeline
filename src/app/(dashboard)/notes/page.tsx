'use client';

import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function NotesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Notes & Knowledge base</h1>
          <p className="text-xs text-slate-400">
            Phase 4 target: Tiptap rich-text editor, note tags, and bi-directional study topic links.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Scheduled for Phase 4</span>
        </div>
      </div>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Tiptap Rich-Text Markdown Editor</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Notes created here will automatically carry a <code className="text-indigo-300 font-mono">study_topic_id</code> foreign key so that every note is linked directly to its overarching study domain.
        </p>
      </div>
    </div>
  );
}
