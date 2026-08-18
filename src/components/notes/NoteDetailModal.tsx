'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Tag as TagIcon,
  Copy,
  Check,
  FileText,
  Trash2,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  FileDown,
  BookOpen,
} from 'lucide-react';
import { NoteItem } from '@/lib/supabase/modules-db';
import { CommentThread } from '../comments/CommentThread';
import { PdfViewer } from './PdfViewer';
import { UploadedFileViewerSection } from './UploadedFileViewerSection';

interface NoteDetailModalProps {
  note: NoteItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({
  note,
  onClose,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);

  // Sync URL query param ?note=<id> for deep-linking
  useEffect(() => {
    if (note && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('note', note.id);
      window.history.replaceState({}, '', url.toString());
    }
  }, [note]);

  if (!note) return null;

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('note');
      window.history.replaceState({}, '', url.toString());
    }
    onClose();
  };

  const handleCopy = () => {
    const fullText = `# ${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
      if (onDelete) onDelete(note.id);
      handleClose();
    }
  };

  const pdfAttachments = note.attachments?.filter((att) => att.type === 'pdf') || [];
  const imageAttachments = note.attachments?.filter((att) => att.type === 'image') || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden flex flex-col animate-slide-in">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white uppercase tracking-wider">
                Module: {note.module}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug break-words">
              {note.title}
            </h2>
            {note.title_bn && note.title_bn !== note.title && (
              <p className="text-xs text-emerald-200 font-bold">{note.title_bn}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Copy Full Note"
            >
              {copied ? <Check className="w-4 h-4 text-lime-300" /> : <Copy className="w-4 h-4" />}
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-colors"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50/50">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {new Date(note.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <TagIcon className="w-3.5 h-3.5 text-emerald-600" />
                {note.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Main Content View */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs leading-relaxed text-slate-800 text-sm font-sans whitespace-pre-wrap">
            {note.content}
          </div>

          {/* INLINE PDF VIEWER IF ACTIVATED */}
          {activePdfUrl && (
            <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-emerald-500">
              <PdfViewer pdfUrl={activePdfUrl} title={note.title} onClose={() => setActivePdfUrl(null)} />
            </div>
          )}

          {/* ENHANCED UPLOADED FILE & IMAGE VIEWER WITH EXTRA SECTION */}
          <UploadedFileViewerSection
            files={note.attachments}
            imageUrls={note.image_urls}
            pdfUrl={(note as any).pdf_url}
            title={note.title}
            onOpenPdf={(url) => setActivePdfUrl(url)}
          />

          {/* Threaded Discussion & Study Comments */}
          <CommentThread parentType="note" parentId={note.id} />
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Full Note' : 'Copy Note'}</span>
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-colors"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
