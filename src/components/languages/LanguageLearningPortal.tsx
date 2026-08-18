'use client';

import React, { useState, useEffect } from 'react';
import {
  Languages,
  Volume2,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  X,
  CheckCircle,
} from 'lucide-react';
import { FlashcardItem, fetchVocab, createVocab, updateVocab, deleteVocab } from '@/lib/supabase/vocab-db';

export const LanguageLearningPortal: React.FC = () => {
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [selectedLang, setSelectedLang] = useState<'All' | 'Spanish' | 'English'>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardItem | null>(null);

  // Form Fields
  const [formLang, setFormLang] = useState<'English' | 'Spanish'>('Spanish');
  const [formWord, setFormWord] = useState('');
  const [formPhonetic, setFormPhonetic] = useState('');
  const [formBangla, setFormBangla] = useState('');
  const [formEnglish, setFormEnglish] = useState('');
  const [formExample, setFormExample] = useState('');
  const [formCategory, setFormCategory] = useState<'Daily Speaking' | 'Job Interview' | 'Grammar & Vocab' | 'IT & Office'>('Daily Speaking');

  useEffect(() => {
    loadVocab();
  }, []);

  const loadVocab = async () => {
    const data = await fetchVocab();
    setCards(data);
  };

  const filteredCards = cards.filter(
    (card) => selectedLang === 'All' || card.lang === selectedLang
  );

  const currentCard = filteredCards[currentIndex % (filteredCards.length || 1)] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % (filteredCards.length || 1));
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && currentCard) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentCard.lang === 'Spanish' ? 'es-ES' : 'en-US';
      window.speechSynthesis.speak(utterance);
      setSpeakingText(text);
      setTimeout(() => setSpeakingText(null), 2000);
    }
  };

  const openAddModal = () => {
    setEditingCard(null);
    setFormLang('Spanish');
    setFormWord('');
    setFormPhonetic('');
    setFormBangla('');
    setFormEnglish('');
    setFormExample('');
    setFormCategory('Daily Speaking');
    setIsModalOpen(true);
  };

  const openEditModal = (card: FlashcardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCard(card);
    setFormLang(card.lang);
    setFormWord(card.word);
    setFormPhonetic(card.phonetic);
    setFormBangla(card.bangla_meaning);
    setFormEnglish(card.english_meaning);
    setFormExample(card.example_sentence);
    setFormCategory(card.category);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formWord.trim() || !formBangla.trim()) return;

    if (editingCard) {
      const updated = await updateVocab(editingCard.id, {
        lang: formLang,
        word: formWord,
        phonetic: formPhonetic,
        bangla_meaning: formBangla,
        english_meaning: formEnglish,
        example_sentence: formExample,
        category: formCategory,
      });
      setCards(cards.map((c) => (c.id === editingCard.id ? updated : c)));
    } else {
      const created = await createVocab({
        lang: formLang,
        word: formWord,
        phonetic: formPhonetic,
        bangla_meaning: formBangla,
        english_meaning: formEnglish,
        example_sentence: formExample,
        category: formCategory,
      });
      setCards([created, ...cards]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this vocabulary card?')) return;
    await deleteVocab(id);
    setCards(cards.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            <span>Spoken English & Spanish Vocabulary DB</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Language Learning & Vocabulary Cards</h3>
          <p className="text-xs text-slate-500">Add, edit, listen, and practice English & Spanish words with Bangla translations.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(['All', 'English', 'Spanish'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLang(lang);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedLang === lang
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vocab Card</span>
          </button>
        </div>
      </div>

      {/* Main Flashcard Player */}
      {currentCard ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`cursor-pointer min-h-[260px] p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between select-none shadow-md ${
              isFlipped
                ? 'bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-900 text-white border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-gradient-to-tr from-emerald-50 via-teal-50/40 to-white border-emerald-200 hover:border-emerald-400 text-slate-900'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  currentCard.lang === 'Spanish'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {currentCard.lang} · {currentCard.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => openEditModal(currentCard, e)}
                  className={`p-1.5 rounded-xl transition-colors ${
                    isFlipped ? 'text-slate-300 hover:text-amber-300 hover:bg-white/10' : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-100'
                  }`}
                  title="Edit Card"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(currentCard.id, e)}
                  className={`p-1.5 rounded-xl transition-colors ${
                    isFlipped ? 'text-slate-300 hover:text-red-400 hover:bg-white/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.word);
                  }}
                  className={`p-2 rounded-2xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                    isFlipped
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${speakingText ? 'animate-bounce text-amber-300' : ''}`} />
                  <span>Listen</span>
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="text-center py-6 space-y-3">
              {!isFlipped ? (
                <>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{currentCard.word}</h2>
                  {currentCard.phonetic && (
                    <p className="text-xs font-mono text-emerald-700 font-semibold bg-white/80 py-1 px-3 rounded-full inline-block">
                      Phonetic: [{currentCard.phonetic}]
                    </p>
                  )}
                  <p className="text-xs text-slate-500 italic mt-2">Click to flip card for Bangla meaning & example</p>
                </>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-xs uppercase text-emerald-400 font-mono font-bold">Bangla Meaning</p>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-200">{currentCard.bangla_meaning}</h3>
                  {currentCard.english_meaning && <p className="text-xs text-slate-300 italic">{currentCard.english_meaning}</p>}

                  {currentCard.example_sentence && (
                    <div className="pt-3 border-t border-white/10 text-left bg-white/5 p-3 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-amber-400">Example Sentence:</span>
                      <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-sans">{currentCard.example_sentence}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between text-xs font-mono font-bold opacity-80">
              <span>Card {currentIndex + 1} of {filteredCards.length}</span>
              <span>Tap to Flip 🔄</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % (filteredCards.length || 1));
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Previous Card
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Next Card</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <Languages className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">No cards in this category</p>
          <button onClick={openAddModal} className="text-xs text-emerald-700 font-bold underline">
            Click here to add a new word
          </button>
        </div>
      )}

      {/* Add / Edit Vocab Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-emerald-200 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingCard ? 'Edit Vocabulary Card' : 'Add New Vocabulary Card'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Language</label>
                  <select
                    value={formLang}
                    onChange={(e) => setFormLang(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Daily Speaking">Daily Speaking</option>
                    <option value="Job Interview">Job Interview</option>
                    <option value="Grammar & Vocab">Grammar & Vocab</option>
                    <option value="IT & Office">IT & Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Word or Spoken Phrase</label>
                <input
                  type="text"
                  placeholder="e.g. ¡Buenas tardes! or Articulate"
                  value={formWord}
                  onChange={(e) => setFormWord(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phonetic Guide (Pronunciation)</label>
                <input
                  type="text"
                  placeholder="e.g. BWEH-nahs TAR-des"
                  value={formPhonetic}
                  onChange={(e) => setFormPhonetic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bangla Meaning (বাংলা অর্থ)</label>
                <input
                  type="text"
                  placeholder="e.g. শুভ অপরাহ্ন!"
                  value={formBangla}
                  onChange={(e) => setFormBangla(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">English Meaning (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Good afternoon!"
                  value={formEnglish}
                  onChange={(e) => setFormEnglish(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Example Sentence</label>
                <textarea
                  rows={2}
                  placeholder="e.g. ¡Buenas tardes! ¿Cómo puedo ayudarle hoy?"
                  value={formExample}
                  onChange={(e) => setFormExample(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{editingCard ? 'Save Changes' : 'Save to DB'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
