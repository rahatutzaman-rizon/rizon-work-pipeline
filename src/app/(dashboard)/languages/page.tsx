'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Languages, ChevronRight, Award } from 'lucide-react';
import { ExamQuizEngine } from '@/components/exam/ExamQuizEngine';

export default function LanguagesHubPage() {
  const [activeTab, setActiveTab] = useState<'tracks' | 'exam'>('tracks');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 p-8 text-white shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-lime-400 text-teal-950 uppercase tracking-wider">
                Spoken Language Cards
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                English & Spanish Speaking Portal
              </h1>
              <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
                Practice spoken English and Spanish vocabulary flashcards with native speech audio pronunciation, Bangla meanings, and example usage.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('tracks')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'tracks' ? 'bg-white text-teal-950 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                Language Tracks
              </button>
              <button
                onClick={() => setActiveTab('exam')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'exam' ? 'bg-lime-400 text-teal-950 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Take Language Exam</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Track Selection Grid */}
        {activeTab === 'tracks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/languages/english"
              className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-md hover:shadow-2xl transition-all group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-110 transition-transform">
                🇬🇧
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Spoken English Track
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                  Conversational phrases, corporate interview terms, formal speech patterns, and audio pronunciation.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Explore English Sets</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/languages/spanish"
              className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 shadow-md hover:shadow-2xl transition-all group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-110 transition-transform">
                🇪🇸
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                  Spoken Spanish Track
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                  Basic Spanish daily greetings, travel vocabulary, work phrases, and native Spanish speech audio.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>Explore Spanish Sets</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        )}

        {/* Tab 2: Individual Module Language Exam Engine */}
        {activeTab === 'exam' && (
          <div className="space-y-4">
            <ExamQuizEngine categoryId="languages-all" categoryName="English & Spanish Spoken & Grammar Proficiency" />
          </div>
        )}
      </div>
  );
}
