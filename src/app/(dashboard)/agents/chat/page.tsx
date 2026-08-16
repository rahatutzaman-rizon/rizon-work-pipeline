'use client';
import { Sparkles } from 'lucide-react';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center space-y-4 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold text-white">AI Assistant Chat</h1>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        Interactive AI chat powered by Vercel AI SDK with contextual topic memory.
      </p>
    </div>
  );
}
