'use client';

import React, { useState } from 'react';
import { FileText, ZoomIn, ZoomOut, Download, ExternalLink, ChevronLeft, ChevronRight, BookOpen, X } from 'lucide-react';

interface PdfViewerProps {
  pdfUrl: string;
  title?: string;
  onClose?: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, title = 'Exam Syllabus / Notice Document', onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl">
      {/* Header Toolbar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 truncate max-w-xs">{title}</h4>
            <p className="text-[10px] text-emerald-400">PDF Reader Active · 47th BCS / Bank Circular</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-emerald-400">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download & External Open */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 bg-slate-950/80 p-4 overflow-auto flex justify-center items-center relative min-h-[420px]">
        <div
          className="transition-all duration-200 shadow-2xl rounded bg-white w-full h-full min-h-[450px]"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full min-h-[500px] rounded border-0"
            title={title}
          />
        </div>
      </div>

      {/* Footer Notice */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive Document Viewer</span>
        </span>
        <span className="text-slate-500 font-mono">PDF Embed Engine</span>
      </div>
    </div>
  );
};
