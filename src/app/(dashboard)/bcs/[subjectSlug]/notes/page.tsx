'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Plus } from 'lucide-react';
import { NoteItem, SubjectItem, fetchSubjectBySlug, fetchNotesBySubject, deleteNote } from '@/lib/supabase/modules-db';
import { NoteDetailModal } from '@/components/notes/NoteDetailModal';

export default function BcsSubjectNotesPage({ params }: { params: Promise<{ subjectSlug: string }> }) {
  const resolvedParams = use(params);
  const subjectSlug = resolvedParams.subjectSlug;

  const [subject, setSubject] = useState<SubjectItem | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  useEffect(() => {
    loadNotes();
  }, [subjectSlug]);

  const loadNotes = async () => {
    setLoading(true);
    const sub = await fetchSubjectBySlug('bcs', subjectSlug);
    setSubject(sub);
    if (sub) {
      const list = await fetchNotesBySubject('bcs', sub.id);
      setNotes(list);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete note?')) {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Notes...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <Link href={`/bcs/${subjectSlug}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700">
        <ArrowLeft className="w-4 h-4 text-emerald-600" />
        <span>Back to {subject?.name_bn || subjectSlug} Workspace</span>
      </Link>

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-black text-slate-900">Notes List: {subject?.name_bn || subjectSlug}</h1>
        </div>
      </div>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-3"
            >
              <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">{note.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3 rounded-xl">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 font-bold">
          No notes saved yet for this subject in Supabase.
        </div>
      )}

      <NoteDetailModal note={selectedNote} onClose={() => setSelectedNote(null)} onDelete={handleDelete} />
    </div>
  );
}
