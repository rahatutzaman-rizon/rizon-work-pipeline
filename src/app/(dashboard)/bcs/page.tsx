'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Languages,
  Landmark,
  Globe,
  Compass,
  Atom,
  Cpu,
  Calculator,
  Brain,
  ShieldCheck,
  ChevronRight,
  Award,
} from 'lucide-react';
import { SubjectItem, fetchSubjectsByModule } from '@/lib/supabase/modules-db';
import { ExamQuizEngine } from '@/components/exam/ExamQuizEngine';

const ICON_MAP: Record<string, any> = {
  bangla: BookOpen,
  english: Languages,
  'bangladesh-affairs': Landmark,
  'international-affairs': Globe,
  geography: Compass,
  'general-science': Atom,
  'computer-it': Cpu,
  mathematics: Calculator,
  'mental-ability': Brain,
  'ethics-governance': ShieldCheck,
};

export default function BcsHubPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'subjects' | 'exam'>('subjects');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    const data = await fetchSubjectsByModule('bcs');
    setSubjects(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-8 text-white shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-lime-400 text-emerald-950 uppercase tracking-wider">
                  Official BPSC Syllabus 47th BCS
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                  10 Subjects • 200 Marks
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                BCS Preliminary Exam Hub
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                Complete Preliminary syllabus breakdown. Select any subject below to create study notes, track tasks, and solve practice questions.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('subjects')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'subjects' ? 'bg-white text-emerald-900 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                10 Subjects Grid
              </button>
              <button
                onClick={() => setActiveTab('exam')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'exam' ? 'bg-lime-400 text-emerald-950 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Take BCS Exam</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: 10 Subjects Grid */}
        {activeTab === 'subjects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>10 Preliminary Subjects ({subjects.length})</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">Source: BPSC Official Syllabus</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 font-bold">Loading BPSC Subjects...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {subjects.map((sub) => {
                  const Icon = ICON_MAP[sub.slug] || BookOpen;
                  return (
                    <Link
                      key={sub.id}
                      href={`/bcs/${sub.slug}`}
                      className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {sub.marks} Marks
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {sub.name_bn || sub.name_en}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{sub.name_en}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                        <span>Open Subject Workspace</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Individual Module BCS Exam Engine */}
        {activeTab === 'exam' && (
          <div className="space-y-4">
            <ExamQuizEngine categoryId="bcs-all" categoryName="BCS 47th Preliminary & Written" />
          </div>
        )}
      </div>
  );
}
