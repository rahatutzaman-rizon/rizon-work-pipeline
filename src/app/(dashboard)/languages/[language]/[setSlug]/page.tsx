'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { VocabCardItem, fetchVocabSets, fetchVocabCards } from '@/lib/supabase/modules-db';

export default function FlashcardPlayerPage({ params }: { params: Promise<{ language: string; setSlug: string }> }) {
  const resolvedParams = use(params);
  const { language, setSlug } = resolvedParams;

  const [cards, setCards] = useState<VocabCardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, [language, setSlug]);

  const loadCards = async () => {
    setLoading(true);
    const sets = await fetchVocabSets(language as any);
    const targetSet = sets.find((s) => s.slug === setSlug);

    if (targetSet) {
      const cList = await fetchVocabCards(targetSet.id);
      setCards(cList);
    }
    setLoading(false);
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'spanish' ? 'es-ES' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Flashcards...</div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Link href={`/languages/${language}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700">
        <ArrowLeft className="w-4 h-4 text-emerald-600" />
        <span>Back to {language.toUpperCase()} Vocabulary Sets</span>
      </Link>

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
            {language} Flashcard Deck
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 capitalize">{setSlug.replace('-', ' ')}</h1>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">
          Card {cards.length > 0 ? currentIndex + 1 : 0} of {cards.length}
        </span>
      </div>

      {cards.length > 0 && currentCard ? (
        <div className="space-y-6">
          {/* Main Interactive Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[320px] p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 border-2 border-emerald-300 shadow-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.01]"
          >
            {!isFlipped ? (
              /* FRONT OF CARD */
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Tap Card to Reveal Meaning
                </span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{currentCard.word}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.word);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 mx-auto shadow-md"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Pronunciation</span>
                </button>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="space-y-4">
                <span className="text-xs font-bold text-lime-600 uppercase tracking-widest">
                  Bangla Meaning & Usage
                </span>
                <h3 className="text-3xl font-black text-emerald-950">{currentCard.meaning_bn}</h3>
                {currentCard.example_sentence && (
                  <p className="text-xs text-slate-700 italic max-w-md bg-white p-3 rounded-xl border border-emerald-100">
                    "{currentCard.example_sentence}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(Math.max(0, currentIndex - 1));
              }}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-xs font-extrabold text-slate-800 flex items-center gap-1 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1));
              }}
              disabled={currentIndex === cards.length - 1}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-xs font-extrabold text-white flex items-center gap-1 shadow-md"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 font-bold">
          No vocabulary cards seeded yet in Supabase for this set.
        </div>
      )}
    </div>
  );
}
