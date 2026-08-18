'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  ChevronRight,
  FileCheck2,
  Award,
  BookOpen,
} from 'lucide-react';
import { SubjectItem, fetchSubjectsByModule } from '@/lib/supabase/modules-db';
import { ModuleAuthGuard } from '@/components/auth/ModuleAuthGuard';
import { ExamQuizEngine } from '@/components/exam/ExamQuizEngine';

export default function BankItHubPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'subjects' | 'exam'>('subjects');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    const data = await fetchSubjectsByModule('bank-it');
    setSubjects(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 p-8 text-white shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-lime-400 text-teal-950 uppercase tracking-wider">
                  Bangladesh Bank & 9 Combined Banks
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                  Senior Officer (IT / ICT)
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Bank IT & ICT Officer Hub
              </h1>
              <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
                Targeted preparation for Senior Officer IT, System Analyst, Programmer, and Assistant Maintenance Engineer exams.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('subjects')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'subjects' ? 'bg-white text-teal-900 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                Bank IT Subjects
              </button>
              <button
                onClick={() => setActiveTab('exam')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'exam' ? 'bg-lime-400 text-teal-950 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Take Bank IT Exam</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Bank IT Subjects */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            {/* STATIC EXAM PATTERN REFERENCE SECTION */}
            <div className="p-6 rounded-3xl bg-white border border-teal-200 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-teal-100 pb-3">
                <FileCheck2 className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-black text-slate-900">
                  Official Bank IT Exam Pattern Reference
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
                  <h4 className="font-extrabold text-teal-950 uppercase">1. Preliminary MCQ Exam (100 Marks)</h4>
                  <ul className="space-y-1 text-slate-700 list-disc list-inside">
                    <li>Computer Science & ICT Technical: 40 Marks</li>
                    <li>Bangla & English: 30 Marks (Focus on Technical Terms)</li>
                    <li>General Mathematics & Analytical: 20 Marks</li>
                    <li>General Knowledge & Banking: 10 Marks</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <h4 className="font-extrabold text-emerald-950 uppercase">2. Written Test Breakdown (200 Marks)</h4>
                  <ul className="space-y-1 text-slate-700 list-disc list-inside">
                    <li>Software Engineering & System Analysis: 50 Marks</li>
                    <li>Database Management & SQL Queries: 40 Marks</li>
                    <li>Data Structures, Algorithms & Coding: 40 Marks</li>
                    <li>Computer Networks & Cyber Security: 40 Marks</li>
                    <li>Focus Writing & Translation: 30 Marks</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Subject / Topic Groups Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  <span>Technical Bank IT Subjects ({subjects.length})</span>
                </h2>
                <span className="text-xs font-bold text-slate-500">Source: BBSC & BUET Pattern</span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-500 font-bold">Loading Bank IT Subjects...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {subjects.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/bank-it/${sub.slug}`}
                      className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200">
                            Technical
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                            {sub.name_bn || sub.name_en}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{sub.name_en}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
                        <span>Open Subject Workspace</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Individual Module Bank IT Exam Engine */}
        {activeTab === 'exam' && (
          <div className="space-y-4">
            <ExamQuizEngine categoryId="bank-it-all" categoryName="Senior Officer IT & System Analyst" />
          </div>
        )}
      </div>
  );
}
