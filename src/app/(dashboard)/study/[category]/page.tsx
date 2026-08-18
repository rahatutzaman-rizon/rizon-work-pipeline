'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Tag as TagIcon,
  Image as ImageIcon,
  FileText,
  Languages,
  Database,
  Eye,
  X,
  Zap,
} from 'lucide-react';
import { useCategoryStore } from '@/lib/store/category-store';
import { DynamicIcon } from '@/components/common/IconPicker';
import { NoteItem } from '@/types';
import { fetchNotes, createNote, deleteNote } from '@/lib/supabase/notes-db';
import { convertPhoneticToBangla } from '@/lib/bangla-converter';
import { PdfViewer } from '@/components/notes/PdfViewer';
import { ExamQuizEngine } from '@/components/exam/ExamQuizEngine';
import { RizonPortfolioCv } from '@/components/portfolio/RizonPortfolioCv';
import { BanglaAvroEditor } from '@/components/notes/BanglaAvroEditor';
import { NoteDetailModal } from '@/components/notes/NoteDetailModal';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';

const BANGLA_QUICK_KEYS = [
  'অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ',
  'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
  'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন',
  'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ',
  'স', 'হ', 'ড়', 'ঢ়', 'য়', 'ৎ', 'ং', 'ঃ', 'ঁ', '৳',
];

export default function StudyCategoryPage() {
  const params = useParams();
  const slug = (params?.category as string) || '';

  const { categories, openCreateModal, openEditModal, loadCategories } = useCategoryStore();

  const [topicNotes, setTopicNotes] = useState<NoteItem[]>([]);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState<boolean>(false);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [selectedNoteModal, setSelectedNoteModal] = useState<NoteItem | null>(null);
  const [selectedTaskModal, setSelectedTaskModal] = useState<any | null>(null);

  // Form State for Topic Note Creation
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formTags, setFormTags] = useState<string>('BCS 47th, PYQ');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formPdfUrl, setFormPdfUrl] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [phoneticInput, setPhoneticInput] = useState<string>('');

  useEffect(() => {
    loadCategories();
    loadTopicNotes();
  }, [slug]);

  const currentCategory = categories.find((c) => c.slug === slug);
  const subCategories = categories.filter((c) => c?.parent_id === currentCategory?.id);
  const parentCategory = currentCategory?.parent_id
    ? categories.find((c) => c.id === currentCategory.parent_id)
    : null;

  const loadTopicNotes = async () => {
    const allNotes = await fetchNotes();
    if (currentCategory) {
      setTopicNotes(allNotes.filter((n) => n.category_id === currentCategory.id));
    } else {
      setTopicNotes(allNotes);
    }
  };

  if (!currentCategory) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Study Topic Not Found</h2>
        <p className="text-sm text-slate-500">The requested topic "{slug}" was not found in your database.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setFormImages([...formImages, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handlePhoneticConvert = () => {
    if (!phoneticInput.trim()) return;
    const banglaText = convertPhoneticToBangla(phoneticInput);
    setFormContent((prev) => (prev ? prev + '\n' + banglaText : banglaText));
    setPhoneticInput('');
  };

  const handleInsertBanglaChar = (char: string) => {
    setFormContent((prev) => prev + char);
  };

  const handleSaveTopicNote = async () => {
    if (!formTitle.trim() || !formContent.trim()) return;

    const tagsArray = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    const newNote = await createNote({
      category_id: currentCategory.id,
      title: formTitle,
      bangla_title: formTitle,
      content: formContent,
      tags: tagsArray.length > 0 ? tagsArray : ['BCS Topic'],
      image_urls: formImages,
      pdf_url: formPdfUrl.trim() || undefined,
    });

    setTopicNotes([newNote, ...topicNotes]);
    setIsCreatingNote(false);
    resetForm();
  };

  const handleAiAutoGenerateNote = async () => {
    setIsAiGenerating(true);
    setTimeout(async () => {
      const generatedTitle = `${currentCategory.name} - BCS & Exam Important Notes`;
      const generatedContent = `## ${currentCategory.name} (বিসিএস ও চাকরির পরীক্ষার সেরা প্রস্তুতি 노트)

### ১. মূল বিষয়বস্তু ও সংক্ষিপ্ত সারসংক্ষেপ
- **গুরুত্বপূর্ণ অংশ:** এই টপিক থেকে বিসিএস প্রিলিমিনারি ও ব্যাংক লিখিত পরীক্ষায় প্রতি বছর প্রশ্ন আসে।
- **বিসিএস প্রিলির নম্বর বণ্টন:** মোট প্রিলিমিনারি ২০০ নম্বরের মধ্যে এই বিষয়ে ধারাবাহিক প্রশ্ন থাকে।

### ২. শর্টকাট টিপস ও বিষয়ভিত্তিক আলোচনা
- বাংলা ব্যাকরণ ও সাহিত্য বা ব্যাংকিং সংক্রান্ত যাবতীয় সূত্রের সংক্ষিপ্ত নোট নিয়মিত রিভিশন দেওয়া জরুরি।
- আগের বছরের প্রশ্ন (10th to 46th BCS Solved PYQs) চর্চা করুন।

> [!TIP]
> এই নোটটি AI স্টাডি অ্যাসিস্ট্যান্ট দ্বারা স্বয়ংক্রিয়ভাবে তৈরি এবং ডাটাবেজে সংরক্ষণ করা হয়েছে।`;

      const aiNote = await createNote({
        category_id: currentCategory.id,
        title: generatedTitle,
        bangla_title: generatedTitle,
        content: generatedContent,
        tags: ['AI Generated', currentCategory.name, 'BCS Prep'],
        ai_generated: true,
      });

      setTopicNotes([aiNote, ...topicNotes]);
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic note?')) return;
    await deleteNote(id);
    setTopicNotes(topicNotes.filter((n) => n.id !== id));
  };

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormImages([]);
    setFormPdfUrl('');
    setImageUrlInput('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(currentCategory)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Edit Topic</span>
          </button>
        </div>
      </div>

      {/* Topic Hero Banner - Vibrant Parrot Green */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-600 p-8 text-white shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
              style={{ backgroundColor: currentCategory.color || '#10b981' }}
            >
              <DynamicIcon name={currentCategory.icon || 'BookOpen'} className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              {parentCategory && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-bold">
                  <Link href={`/study/${parentCategory.slug}`} className="hover:underline">
                    {parentCategory.name}
                  </Link>
                  <ChevronRight className="w-3 h-3 text-emerald-300" />
                  <span>Sub-Topic</span>
                </div>
              )}
              <h1 className="text-3xl font-black text-white tracking-tight">
                {currentCategory.name}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50 max-w-2xl leading-relaxed">
                {currentCategory.description || 'Subject & Topic Workspace: Add notes, attach diagrams, and view syllabus circulars.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreatingNote(true)}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add Note to {currentCategory.name.split(' ')[0]}</span>
            </button>
            <button
              onClick={handleAiAutoGenerateNote}
              disabled={isAiGenerating}
              className="px-4 py-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Sparkles className={`w-3.5 h-3.5 text-lime-300 ${isAiGenerating ? 'animate-spin' : ''}`} />
              <span>{isAiGenerating ? 'AI Generating...' : 'AI Auto Note'}</span>
            </button>
          </div>
        </div>

        {/* Topic Stats Rollup */}
        <div className="pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-extrabold tracking-wider">Saved Topic Notes</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{topicNotes.length} Notes</span>
              <span className="text-xs text-lime-300 font-bold">Bangla Ready</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-extrabold tracking-wider">Sub-Topics</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{subCategories.length} Sub-modules</span>
              <span className="text-xs text-emerald-200 font-bold">Syllabus Tree</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-extrabold tracking-wider">Database Sync</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-black text-white">Active</span>
              <span className="text-xs text-lime-300 font-extrabold">PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIZON PORTFOLIO CV (If IT Software Automation selected) */}
      {currentCategory.slug === 'it-software-automation' && <RizonPortfolioCv />}

      {/* TOPIC NOTE CREATION FORM (If active) */}
      {isCreatingNote && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xl space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Add Note to "{currentCategory.name}"
              </h3>
            </div>
            <button
              onClick={() => setIsCreatingNote(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Note Title</label>
            <input
              type="text"
              placeholder={`e.g. ${currentCategory.name} - Important Question Rules`}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Bangla Avro Live Converter Editor */}
          <BanglaAvroEditor
            value={formContent}
            onChange={setFormContent}
            placeholder={`Write inner note for ${currentCategory.name} in Banglish (e.g. 'ami ${currentCategory.name} porikkhar jonno note likhchi')...`}
            rows={7}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Attach Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/diagram.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  onClick={handleAddImage}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Attach PDF Link (Syllabus / Paper)</label>
              <input
                type="url"
                placeholder="https://example.com/syllabus.pdf"
                value={formPdfUrl}
                onChange={(e) => setFormPdfUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsCreatingNote(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTopicNote}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Note to Topic</span>
            </button>
          </div>
        </div>
      )}

      {/* TOPIC NOTES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-slate-900">Notes for "{currentCategory.name}" ({topicNotes.length})</h2>
          </div>

          <button
            onClick={() => setIsCreatingNote(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-xs hover:bg-emerald-700 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>

        {topicNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topicNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNoteModal(note)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 cursor-pointer group relative"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      {currentCategory.name.split(' ')[0]}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">{note.title}</h4>

                  <div className="prose text-xs text-slate-700 leading-relaxed line-clamp-4 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl">
                    {note.content}
                  </div>
                </div>

                {/* Images preview */}
                {note.image_urls && note.image_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {note.image_urls.map((img, i) => (
                      <img key={i} src={img} alt="Diagram" className="w-12 h-12 object-cover rounded-lg border" />
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">{new Date(note.created_at).toLocaleDateString()}</span>
                  {note.pdf_url && (
                    <button
                      onClick={() => setActivePdfUrl(note.pdf_url || null)}
                      className="text-teal-700 font-bold flex items-center gap-1 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>View Attached PDF</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <BookOpen className="w-8 h-8 text-emerald-600 mx-auto opacity-60" />
            <p className="text-xs font-bold text-slate-700">No notes created for "{currentCategory.name}" yet.</p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                onClick={() => setIsCreatingNote(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-xs hover:bg-emerald-700"
              >
                Create Note Manually
              </button>
              <button
                onClick={handleAiAutoGenerateNote}
                disabled={isAiGenerating}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-extrabold hover:bg-slate-700 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>Auto Generate with AI</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* EMBEDDED MCQ & WRITTEN EXAM TEST ENGINE */}
      <ExamQuizEngine categoryId={currentCategory.id} categoryName={currentCategory.name} />

      {/* Embedded PDF Viewer Modal / Pane */}
      {activePdfUrl && (
        <div className="pt-4 border-t border-slate-200">
          <PdfViewer pdfUrl={activePdfUrl} title={currentCategory.name} onClose={() => setActivePdfUrl(null)} />
        </div>
      )}

      {/* NESTED SUB-TOPICS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Sub-Topics under "{currentCategory.name}" ({subCategories.length})</h2>
          <button
            onClick={() => openCreateModal(currentCategory.id)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-extrabold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add Sub-Topic</span>
          </button>
        </div>

        {subCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/study/${sub.slug}`}
                className="p-5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 space-y-2 block group shadow-xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="p-2 rounded-xl text-white flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: sub.color || '#10b981' }}
                    >
                      <DynamicIcon name={sub.icon || 'BookOpen'} className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {sub.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {sub.description || 'Nested topic under ' + currentCategory.name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-2xl bg-white border border-slate-200 space-y-2">
            <p className="text-xs text-slate-500">No sub-topics created under "{currentCategory.name}" yet.</p>
            <button
              onClick={() => openCreateModal(currentCategory.id)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Sub-Topic</span>
            </button>
          </div>
        )}
      </div>

      {/* DETAILED SCROLLABLE NOTE MODAL */}
      <NoteDetailModal
        note={selectedNoteModal as any}
        onClose={() => setSelectedNoteModal(null)}
        onDelete={handleDeleteNote}
      />

      {/* DETAILED SCROLLABLE TASK MODAL */}
      <TaskDetailModal
        task={selectedTaskModal}
        onClose={() => setSelectedTaskModal(null)}
      />
    </div>
  );
}
