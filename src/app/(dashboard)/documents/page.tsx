'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, Download, Eye, BookOpen, Search, ExternalLink } from 'lucide-react';
import { PdfViewer } from '@/components/notes/PdfViewer';

const SAMPLE_DOCUMENTS = [
  {
    id: 'doc-1',
    title: '47th BCS Preliminary Official Syllabus & Marks Distribution PDF',
    type: 'BCS Syllabus',
    size: '1.2 MB',
    date: '2026-08-10',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Official 200 marks preliminary syllabus breakdown for Bangla, English, BD & Int Affairs, Math, Computer, Science, and Ethics.',
  },
  {
    id: 'doc-2',
    title: 'Combined 9 Bank Senior Officer Recruitment Notice & Exam Guide',
    type: 'Bank Circular',
    size: '850 KB',
    date: '2026-08-05',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Bangladesh Bank Bankers Selection Committee recruitment syllabus, focus writing topics, and exam rules.',
  },
  {
    id: 'doc-3',
    title: 'IT System Analyst & Assistant Programmer BUET Exam Pattern',
    type: 'IT Exam Syllabus',
    size: '1.8 MB',
    date: '2026-07-28',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'BCC and Ministry ICT recruitment questions blueprint covering OOP, DBMS, DevOps pipelines, and System Design.',
  },
];

export default function DocumentsPage() {
  const [activePdf, setActivePdf] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>('');

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>PDF Circulars & Syllabus Reader</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Documents & <span className="text-emerald-200">PDF Vault</span>
          </h1>
          <p className="text-xs text-emerald-100 max-w-xl">
            Access official BCS, Bank Job, and IT Recruitment syllabus PDFs. View embedded documents directly inside your browser.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SAMPLE_DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  {doc.type}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{doc.size}</span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 line-clamp-2">{doc.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{doc.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">{doc.date}</span>
              <button
                onClick={() => {
                  setActivePdf(doc.url);
                  setActiveTitle(doc.title);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {activePdf && (
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
            <span>Embedded PDF Document: {activeTitle}</span>
            <button onClick={() => setActivePdf(null)} className="text-emerald-700 hover:underline">
              Close Reader
            </button>
          </div>
          <PdfViewer pdfUrl={activePdf} title={activeTitle} onClose={() => setActivePdf(null)} />
        </div>
      )}
    </div>
  );
}

