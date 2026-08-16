'use client';
import { FileSearch } from 'lucide-react';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center space-y-4 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
        <FileSearch className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold text-white">PDF Summarizer Agent</h1>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        Extract text from uploaded PDFs using unpdf/pdf-parse and convert into structured notes.
      </p>
    </div>
  );
}
