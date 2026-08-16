'use client';

import React from 'react';
import { FileText, Sparkles, Upload } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Documents & PDF Vault</h1>
          <p className="text-xs text-slate-400">
            Phase 5 target: Supabase storage PDF upload, unpdf text extraction, and metadata link.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Scheduled for Phase 5</span>
        </div>
      </div>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Supabase Storage & PDF Extractor</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Upload PDF textbooks, lecture slides, or papers to auto-summarize and generate study notes with Vercel AI SDK.
        </p>
      </div>
    </div>
  );
}
