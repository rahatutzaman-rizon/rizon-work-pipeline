'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Terminal,
  ChevronRight,
  Award,
} from 'lucide-react';
import { SubjectItem, fetchSubjectsByModule } from '@/lib/supabase/modules-db';
import { RizonPortfolioCv } from '@/components/portfolio/RizonPortfolioCv';
import { ModuleAuthGuard } from '@/components/auth/ModuleAuthGuard';
import { ExamQuizEngine } from '@/components/exam/ExamQuizEngine';

export default function SoftwareAiHubPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'subjects' | 'exam'>('subjects');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    const data = await fetchSubjectsByModule('software-ai');
    setSubjects(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 p-8 text-white shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-lime-400 text-slate-950 uppercase tracking-wider">
                  Full Stack & AI Engineering
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                  RAG • n8n • Multi-Tenant ERP
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Software Engineering & AI Automation Hub
              </h1>
              <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
                System architecture, AI Agents, Vector Search, CI/CD Pipelines, and Workflow Automation engineering notes.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('subjects')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'subjects' ? 'bg-white text-sky-950 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                Engineering Topics
              </button>
              <button
                onClick={() => setActiveTab('exam')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'exam' ? 'bg-lime-400 text-slate-950 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Take Tech Exam</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Engineering Modules */}
        {activeTab === 'subjects' && (
          <div className="space-y-8">
            {/* RIZON INTERACTIVE PORTFOLIO CV */}
            <RizonPortfolioCv />

            {/* Topic Groups Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-sky-600" />
                  <span>Software & AI Engineering Modules ({subjects.length})</span>
                </h2>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-500 font-bold">Loading Engineering Modules...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {subjects.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/software-ai/${sub.slug}`}
                      className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-sky-500 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                            <Terminal className="w-6 h-6" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors">
                            {sub.name_bn || sub.name_en}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{sub.name_en}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-sky-800">
                        <span>Open Topic Workspace</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Individual Tech Exam Engine */}
        {activeTab === 'exam' && (
          <div className="space-y-4">
            <ExamQuizEngine categoryId="software-ai-all" categoryName="Software Engineering & AI Architecture" />
          </div>
        )}
      </div>
  );
}
