'use client';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center space-y-4 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
        <CalendarIcon className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold text-white">Study Calendar</h1>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        Schedule study sessions, deadline targets, and review intervals.
      </p>
    </div>
  );
}
