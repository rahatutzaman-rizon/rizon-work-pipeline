'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Building2,
  Terminal,
  Languages,
  Landmark,
  ShieldCheck,
  Zap,
  Award,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* HERO BANNER - Rich Parrot Green Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 p-8 sm:p-10 text-white shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-black border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-lime-300 animate-pulse" />
              <span>RIZON Admin Authorized Portal • 4 Modules</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Master BCS, Bank IT <br />
              <span className="text-lime-300 font-extrabold">& AI Engineering</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
              Unified workspace for Bangladesh 47th BCS Preliminary, Senior Officer Bank IT exams, Software & AI Automation, and Spoken English/Spanish.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-2 shrink-0 text-right min-w-[200px]">
            <span className="text-[10px] font-black uppercase text-emerald-200 tracking-wider">Portal Access Status</span>
            <div className="text-2xl font-black text-lime-300 flex items-center justify-end gap-1.5">
              <Award className="w-6 h-6 text-lime-400" />
              <span>Authenticated</span>
            </div>
            <span className="text-xs font-bold text-emerald-100 block flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" /> Password Protected
            </span>
          </div>
        </div>
      </div>

      {/* 4 TOP-LEVEL MODULE CARDS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span>4 Primary Study & Career Modules</span>
          </h2>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Click Module to Open Workspace & Take Exam
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module 1: BCS Preliminary */}
          <Link
            href="/bcs"
            className="p-8 rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/40 border-2 border-emerald-200 hover:border-emerald-500 shadow-md hover:shadow-2xl transition-all duration-300 group space-y-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Landmark className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs uppercase tracking-wider">
                10 Subjects • 200 Marks
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                1. BCS Preliminary Hub
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Official BPSC Syllabus breakdown (Bangla, English, BD Affairs, Int Affairs, Science, Computer, Math, Mental Ability, Ethics). Includes Prelim & Written Model Tests.
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-100 flex items-center justify-between text-xs font-black text-emerald-700 group-hover:text-emerald-800">
              <span>Open 10-Subject Workspace & Model Tests</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 2: Bank IT / ICT Jobs */}
          <Link
            href="/bank-it"
            className="p-8 rounded-3xl bg-gradient-to-br from-white via-teal-50/30 to-teal-100/40 border-2 border-teal-200 hover:border-teal-500 shadow-md hover:shadow-2xl transition-all duration-300 group space-y-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-700 text-white shadow-xs uppercase tracking-wider">
                Senior Officer IT
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                2. Bank IT & ICT Jobs
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Targeted preparation for Senior Officer IT, System Analyst, Programmer (Computer Fundamentals, OS, SQL, Networking, Cyber Security).
              </p>
            </div>

            <div className="pt-4 border-t border-teal-100 flex items-center justify-between text-xs font-black text-teal-700 group-hover:text-teal-800">
              <span>Open Technical Exam Breakdown</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 3: Software Engineering & AI */}
          <Link
            href="/software-ai"
            className="p-8 rounded-3xl bg-gradient-to-br from-white via-sky-50/30 to-blue-100/40 border-2 border-sky-200 hover:border-sky-500 shadow-md hover:shadow-2xl transition-all duration-300 group space-y-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-800 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Terminal className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-700 text-white shadow-xs uppercase tracking-wider">
                RAG • n8n • SaaS
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-sky-700 transition-colors">
                3. Software & AI Engineering
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Full Stack & AI Automation portfolio for Rahatutzaman Rizon (System Design, Next.js/Node.js, Docker CI/CD, n8n, AI Agents).
              </p>
            </div>

            <div className="pt-4 border-t border-sky-100 flex items-center justify-between text-xs font-black text-sky-700 group-hover:text-sky-800">
              <span>Open Engineering Portfolio & Tech Quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 4: English & Spanish Speaking */}
          <Link
            href="/languages"
            className="p-8 rounded-3xl bg-gradient-to-br from-white via-lime-50/30 to-emerald-100/40 border-2 border-lime-300 hover:border-lime-500 shadow-md hover:shadow-2xl transition-all duration-300 group space-y-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-lime-600 to-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Languages className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-lime-600 text-white shadow-xs uppercase tracking-wider">
                Audio Cards & AI Tutor
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-lime-700 transition-colors">
                4. Spoken English & Spanish
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Interactive audio flashcards, speech pronunciation player, writing grammar corrector, and live AI tutor chat.
              </p>
            </div>

            <div className="pt-4 border-t border-lime-100 flex items-center justify-between text-xs font-black text-lime-700 group-hover:text-lime-800">
              <span>Open Spoken Language Coach</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
