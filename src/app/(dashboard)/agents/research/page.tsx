'use client';
import { Bot } from 'lucide-react';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center space-y-4 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto">
        <Bot className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold text-white">Research Agent</h1>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        Autonomous agent for deep topic research and generating structured study guides.
      </p>
    </div>
  );
}
