'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
  ListPlus,
  Image as ImageIcon,
  FileText,
  Upload,
} from 'lucide-react';
import {
  SubjectItem,
  NoteItem,
  TaskItem,
  fetchSubjectBySlug,
  fetchNotesBySubject,
  fetchTasksBySubject,
  createNote,
  createTask,
  deleteNote,
  deleteTask,
} from '@/lib/supabase/modules-db';
import { BanglaAvroEditor } from '@/components/notes/BanglaAvroEditor';
import { NoteDetailModal } from '@/components/notes/NoteDetailModal';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { UploadedFileViewerSection } from '@/components/notes/UploadedFileViewerSection';

export default function BcsSubjectWorkspacePage({ params }: { params: Promise<{ subjectSlug: string }> }) {
  const resolvedParams = use(params);
  const subjectSlug = resolvedParams.subjectSlug;

  const [subject, setSubject] = useState<SubjectItem | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Modals & Creation forms
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  // Form State Note + File Attachments (Images & PDFs)
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('BCS, Revision');
  const [attachedFiles, setAttachedFiles] = useState<{ type: 'image' | 'pdf'; url: string; name: string }[]>([]);

  // Form State Task (Detailed)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ text: string; done: boolean }[]>([]);

  useEffect(() => {
    loadData();
  }, [subjectSlug]);

  const loadData = async () => {
    setLoading(true);
    const sub = await fetchSubjectBySlug('bcs', subjectSlug);
    setSubject(sub);

    if (sub) {
      const targetId = sub.id || subjectSlug;
      const [nList, tList] = await Promise.all([
        fetchNotesBySubject('bcs', targetId),
        fetchTasksBySubject('bcs', targetId),
      ]);
      setNotes(nList);
      setTasks(tList);
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const type = isPdf ? 'pdf' : 'image';

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAttachedFiles((prev) => [...prev, { type, url: reader.result as string, name: file.name }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !noteTitle.trim() || !noteContent.trim()) return;

    const targetId = subject.id || subjectSlug;
    const created = await createNote({
      module: 'bcs',
      subject_id: targetId,
      title: noteTitle,
      content: noteContent,
      tags: noteTags.split(',').map((t) => t.trim()),
      attachments: attachedFiles,
    });

    if (created) {
      setNotes([created, ...notes]);
      setNoteTitle('');
      setNoteContent('');
      setAttachedFiles([]);
      setShowCreateNote(false);
    }
  };

  const handleAddChecklistItem = () => {
    if (!checklistInput.trim()) return;
    setChecklistItems([...checklistItems, { text: checklistInput.trim(), done: false }]);
    setChecklistInput('');
  };

  const handleRemoveChecklistItem = (idx: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== idx));
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !taskTitle.trim()) return;

    const targetId = subject.id || subjectSlug;
    const created = await createTask({
      module: 'bcs',
      subject_id: targetId,
      title: taskTitle,
      description: taskDesc,
      priority: taskPriority,
      due_date: taskDueDate || undefined,
      checklist: checklistItems,
    });

    if (created) {
      setTasks([created, ...tasks]);
      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('medium');
      setTaskDueDate('');
      setChecklistItems([]);
      setShowCreateTask(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Delete this note?')) {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-bold">Loading BCS Subject Workspace...</div>;
  }

  if (!subject) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Subject Not Found</h2>
        <Link href="/bcs" className="text-xs font-bold text-emerald-600 hover:underline">
          Return to BCS Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/bcs" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700">
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to BCS Hub</span>
        </Link>

        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-lime-400 text-emerald-950 uppercase">
              BCS Preliminary ({subject.marks} Marks)
            </span>
            <h1 className="text-3xl font-black text-white mt-2">
              {subject.name_bn || subject.name_en}
            </h1>
            <p className="text-xs text-emerald-100 mt-1">{subject.name_en}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowCreateNote(true);
                setShowCreateTask(false);
              }}
              className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-emerald-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Study Note & Files</span>
            </button>
            <button
              onClick={() => {
                setShowCreateTask(true);
                setShowCreateNote(false);
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* CREATE NOTE FORM WITH PDF & IMAGE FILE UPLOAD */}
      {showCreateNote && (
        <form onSubmit={handleCreateNote} className="p-6 bg-white rounded-3xl border-2 border-emerald-500 shadow-xl space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Create Note & Attach Files (PDF / Image) for {subject.name_en}</span>
            </h3>
            <button type="button" onClick={() => setShowCreateNote(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Note Title..."
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          />

          <BanglaAvroEditor
            value={noteContent}
            onChange={(val) => setNoteContent(val)}
            placeholder="Type content in English or phonetic Bangla (e.g. 'bcs prili')..."
          />

          {/* PDF AND IMAGE FILE ATTACHMENT SECTION */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Attach Study Files (PDFs & Images)</span>
            </label>

            <div className="flex items-center gap-3">
              <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl cursor-pointer inline-flex items-center gap-1.5 border border-slate-300">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload PDF or Image File</span>
                <input type="file" accept="image/*,application/pdf" multiple onChange={handleFileUpload} className="hidden" />
              </label>
              <span className="text-[11px] text-slate-500">{attachedFiles.length} file(s) attached</span>
            </div>

            {/* ENHANCED UPLOADED FILE VIEWER WITH EXTRA SECTION */}
            {attachedFiles.length > 0 && (
              <UploadedFileViewerSection
                files={attachedFiles}
                isEditable={true}
                onRemoveFile={(idx) => handleRemoveFile(idx)}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowCreateNote(false)} className="px-4 py-2 text-xs font-bold text-slate-600">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md">
              Save Note & Files to Database
            </button>
          </div>
        </form>
      )}

      {/* CREATE TASK DETAILED FORM */}
      {showCreateTask && (
        <form onSubmit={handleCreateTask} className="p-6 bg-white rounded-3xl border-2 border-emerald-500 shadow-xl space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Create Detailed Task for {subject.name_en}</span>
            </h3>
            <button type="button" onClick={() => setShowCreateTask(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Task Title (e.g. Read Bangla Grammar Chapter 3)..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          />

          <textarea
            placeholder="Detailed Description / Study Instructions..."
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            rows={3}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* CHECKLIST ITEMS BUILDER */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <ListPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sub-Tasks / Checklist Items</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add sub-task bullet item..."
                value={checklistInput}
                onChange={(e) => setChecklistInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl"
              >
                Add
              </button>
            </div>

            {checklistItems.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {checklistItems.map((chk, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-medium text-slate-800">{chk.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setShowCreateTask(false)} className="px-4 py-2 text-xs font-bold text-slate-600">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold shadow-xs">
              Save Task Details
            </button>
          </div>
        </form>
      )}

      {/* NOTES LIST WITH FILE PREVIEWS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900">
            {subject.name_en} Notes ({notes.length})
          </h2>
        </div>

        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    {subject.name_en.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">{note.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3 rounded-xl">
                  {note.content}
                </p>

                {/* FILE ATTACHMENTS BADGES & THUMBNAILS */}
                {note.attachments && note.attachments.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {note.attachments.map((att, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                        {att.type === 'pdf' ? <FileText className="w-3 h-3 text-red-500" /> : <ImageIcon className="w-3 h-3 text-emerald-600" />}
                        <span className="truncate max-w-[120px]">{att.name || att.type.toUpperCase()}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs font-bold">
            No notes created for {subject.name_bn || subject.name_en} yet. Click "Add Study Note & Files" above.
          </div>
        )}
      </div>

      {/* TASKS LIST */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900">
            {subject.name_en} Tasks ({tasks.length})
          </h2>
        </div>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      Priority: {t.priority}
                    </span>
                    {t.due_date && (
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        <span>{t.due_date}</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">{t.title}</h4>
                  {t.description && (
                    <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                  )}
                </div>
                <span className="text-xs font-bold text-emerald-700 shrink-0">View Detail</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs font-bold">
            No tasks added for {subject.name_bn || subject.name_en} yet.
          </div>
        )}
      </div>

      {/* DETAIL MODALS */}
      <NoteDetailModal note={selectedNote} onClose={() => setSelectedNote(null)} onDelete={handleDeleteNote} />
      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} onRefresh={loadData} />
    </div>
  );
}
