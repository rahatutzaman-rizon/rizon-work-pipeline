'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Tag as TagIcon,
  Image as ImageIcon,
  FileText,
  Pin,
  Trash2,
  Sparkles,
  Type,
  X,
  Eye,
  Languages,
  Upload,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { NoteItem, Category } from '@/types';
import { fetchNotes, createNote, deleteNote } from '@/lib/supabase/notes-db';
import { fetchCategories } from '@/lib/supabase/db';
import { convertPhoneticToBangla } from '@/lib/bangla-converter';
import { PdfViewer } from './PdfViewer';
import { BanglaAvroEditor } from './BanglaAvroEditor';
import { NoteDetailModal } from './NoteDetailModal';
import { UploadedFileViewerSection } from './UploadedFileViewerSection';

const BANGLA_QUICK_KEYS = [
  'অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ',
  'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
  'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন',
  'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ',
  'স', 'হ', 'ড়', 'ঢ়', 'য়', 'ৎ', 'ং', 'ঃ', 'ঁ', '৳',
];

export const NotesManager: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [selectedNoteModal, setSelectedNoteModal] = useState<NoteItem | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formTags, setFormTags] = useState<string>('BCS 47th, Bangla');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formPdfUrl, setFormPdfUrl] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [phoneticMode, setPhoneticMode] = useState<boolean>(true);
  const [phoneticInput, setPhoneticInput] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [fetchedNotes, fetchedCats] = await Promise.all([fetchNotes(), fetchCategories()]);
    setNotes(fetchedNotes);
    setCategories(fetchedCats);
    if (fetchedCats.length > 0) {
      setFormCategory(fetchedCats[0].id);
    }
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setFormImages([...formImages, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(formImages.filter((_, i) => i !== index));
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

  const handleSaveNote = async () => {
    if (!formTitle.trim() || !formContent.trim() || !formCategory) return;

    const tagsArray = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    const newNote = await createNote({
      category_id: formCategory,
      title: formTitle,
      bangla_title: formTitle,
      content: formContent,
      tags: tagsArray.length > 0 ? tagsArray : ['BCS'],
      image_urls: formImages,
      pdf_url: formPdfUrl.trim() || undefined,
    });

    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setIsCreating(false);
    resetForm();
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this note?')) return;
    await deleteNote(id);
    setNotes(notes.filter((n) => n.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormImages([]);
    setFormPdfUrl('');
    setImageUrlInput('');
  };

  const filteredNotes = notes.filter((n) => {
    const matchesCat = selectedCategory === 'all' || n.category_id === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>Bangla Note Base & Subject Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            BCS & Job Prep <span className="text-emerald-200">Study Notes</span>
          </h1>
          <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
            Write Bangla text, attach diagrams, upload circular images, and view embedded PDFs directly alongside your notes.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setActiveNote(null);
            resetForm();
          }}
          className="px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-extrabold shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Create New Note</span>
        </button>
      </div>

      {/* Main Grid: Left Notes List & Right Editor / Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subject Filters & Notes List (5 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search & Subject Selector */}
          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search notes, Bangla topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Subjects ({notes.length})
              </button>
              {categories.map((cat) => {
                const count = notes.filter((n) => n.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <span>{cat.name.split(' ')[0]}</span>
                    <span className="opacity-75 font-mono text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes Cards List */}
          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No study notes found</p>
                <p className="text-[11px] text-slate-400">
                  Click 'Create New Note' or ask the AI Assistant to auto-generate notes for your subject!
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                const cat = categories.find((c) => c.id === note.category_id);

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setActiveNote(note);
                      setIsCreating(false);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                        style={{ backgroundColor: cat?.color || '#10b981' }}
                      >
                        {cat ? cat.name.split(' ')[0] : 'BCS Note'}
                      </span>

                      <div className="flex items-center gap-1">
                        {note.ai_generated && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> AI
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 mt-2 line-clamp-1">
                      {note.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {note.content.replace(/[#*`]/g, '')}
                    </p>

                    {/* Footer icons */}
                    <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 border-t border-slate-100/80 pt-2">
                      <div className="flex items-center gap-2">
                        {note.image_urls && note.image_urls.length > 0 && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <ImageIcon className="w-3 h-3" /> {note.image_urls.length} image
                          </span>
                        )}
                        {note.pdf_url && (
                          <span className="flex items-center gap-1 text-teal-600 font-semibold">
                            <FileText className="w-3 h-3" /> PDF Attached
                          </span>
                        )}
                      </div>
                      <span className="font-mono">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Editor OR Active Note Viewer (7 cols) */}
        <div className="lg:col-span-8">
          {isCreating ? (
            /* CREATE NOTE FORM */
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-lg space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Create BCS / Job Prep Note</h3>
                </div>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Subject & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Subject</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Note Title (Bangla / English)</label>
                  <input
                    type="text"
                    placeholder="e.g. চর্যাপদ গুরুত্বপূর্ণ পদকার ও সাল"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bangla Avro Live Converter Editor */}
              <BanglaAvroEditor
                value={formContent}
                onChange={setFormContent}
                placeholder="Write study note in Banglish (e.g. 'ami bcs bangla sahityo o charpyapad porchi')..."
                rows={8}
              />

              {/* Attach Images & PDF URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Attach Image URL</label>
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
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
                    >
                      Add Image
                    </button>
                  </div>
                  {formImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formImages.map((img, idx) => (
                        <div key={idx} className="relative group w-12 h-12 rounded-lg overflow-hidden border">
                          <img src={img} alt="Attached" className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attach PDF Link (Circular / Syllabus)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/syllabus.pdf"
                    value={formPdfUrl}
                    onChange={(e) => setFormPdfUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Comma Separated Tags</label>
                <input
                  type="text"
                  placeholder="BCS 47th, Bangla Literature, PYQ"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Note to Database</span>
                </button>
              </div>
            </div>
          ) : activeNote ? (
            /* ACTIVE NOTE DISPLAY VIEW */
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6 animate-fade-in">
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {categories.find((c) => c.id === activeNote.category_id)?.name || 'Study Domain'}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-2">{activeNote.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Saved on {new Date(activeNote.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeNote.pdf_url && (
                    <button
                      onClick={() => setActivePdfUrl(activeNote.pdf_url || null)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span>Open Embedded PDF</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteNote(activeNote.id, e)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {activeNote.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <TagIcon className="w-3 h-3 text-emerald-600" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>

              {/* Uploaded Files & Images Extra Section */}
              <UploadedFileViewerSection
                imageUrls={activeNote.image_urls}
                pdfUrl={activeNote.pdf_url}
                title={activeNote.title}
                onOpenPdf={(url) => setActivePdfUrl(url)}
              />

              {/* Note Content Text */}
              <div className="prose max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 font-sans">
                {activeNote.content}
              </div>

              {/* Embedded PDF Reader Drawer (if active) */}
              {activePdfUrl && (
                <div className="pt-4 border-t border-slate-200">
                  <PdfViewer pdfUrl={activePdfUrl} title={activeNote.title} onClose={() => setActivePdfUrl(null)} />
                </div>
              )}
            </div>
          ) : (
            /* EMPTY UNSELECTED STATE */
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Select a Note or Create New</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose any study note from the left sidebar to view Bangla text, attached diagrams, and PDF circulars, or click 'Create New Note' above.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED SCROLLABLE NOTE MODAL */}
      <NoteDetailModal
        note={selectedNoteModal as any}
        onClose={() => setSelectedNoteModal(null)}
        onDelete={async (id) => {
          await deleteNote(id);
          setNotes(notes.filter((n) => n.id !== id));
        }}
      />
    </div>
  );
};
