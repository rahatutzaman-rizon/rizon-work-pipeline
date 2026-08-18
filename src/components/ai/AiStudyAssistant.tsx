'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  CheckCircle,
  Database,
  Bot,
  User,
  GraduationCap,
  Languages,
  Terminal,
  Building2,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { createNote } from '@/lib/supabase/notes-db';
import { fetchCategories } from '@/lib/supabase/db';
import { Category } from '@/types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  category_slug?: string;
  saved_to_db?: boolean;
}

const PRESET_PROMPTS = [
  {
    label: '47th BCS Bangla Literature Note',
    category_id: '11111111-1111-1111-1111-111111111111',
    prompt: 'Generate detailed 47th BCS study notes on Bangla Literature (চর্যাপদ ও মধ্যযুগের মঙ্গলকাব্য). Include bullet points, important authors, and exam tips.',
  },
  {
    label: 'Bank Math Profit & Loss Shortcuts',
    category_id: '77777777-7777-7777-7777-777777777777',
    prompt: 'Generate a structured study note with key formulas and shortcut tricks for Bank Exam Profit & Loss and Pipe-Cistern math problems.',
  },
  {
    label: 'IT & Software DevOps Automation',
    category_id: '88888888-8888-8888-8888-888888888888',
    prompt: 'Generate an IT System Analyst study note covering CI/CD pipelines, Docker containerization, and Python automation for BUET/BCC exams.',
  },
  {
    label: 'Spoken Spanish Daily Phrases',
    category_id: '99999999-9999-9999-9999-999999999999',
    prompt: 'Generate a Spoken Spanish learning guide with phonetic pronunciations, Bangla meanings, and everyday conversational phrases.',
  },
];

export const AiStudyAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I am your **Rizon AI Study Assistant** 🎓

I can help you:
1. **Auto-Generate Study Notes** for BCS, Bank Exams, IT Software Automation, English & Spanish.
2. **1-Click Save to DB**: Automatically save generated AI notes into your personal database store.
3. **Bangla Text & Formula Explanations**: Ask any questions in Bangla or English!

Select a preset prompt below or type your study topic to get started.`,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [savedNotesCount, setSavedNotesCount] = useState(0);

  React.useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleSend = async (customText?: string, targetCatId?: string) => {
    const query = customText || inputPrompt;
    if (!query.trim() || isGenerating) return;

    const userMsgId = crypto.randomUUID();
    const userMsg: Message = { id: userMsgId, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setIsGenerating(true);

    // Simulate AI study note generation response with high-quality content
    setTimeout(async () => {
      let aiResponseText = '';

      if (query.toLowerCase().includes('bangla') || query.toLowerCase().includes('bcs') || query.toLowerCase().includes('চর্যাপদ')) {
        aiResponseText = `## ৪৭তম বিসিএস বাংলা ভাষা ও সাহিত্য প্রস্তুতি নোট

### ১. চর্যাপদ (বাংলা সাহিত্যের আদি নিদর্শন)
- **উদ্ভব কাল:** খ্রিস্টীয় সপ্তম থেকে দ্বাদশ শতাব্দী (ড. সুনীতিকুমার চট্টোপাধ্যায়ের মতে ৯৫০-১২০০ খ্রি.)।
- **প্রধান পদকারগণ:**
  - **কাহ্নপা:** সর্বাপেক্ষা বেশি ১৩টি পদের রচয়িতা।
  - **ভুসুকুপা:** নিজেকে 'বাঙালি' হিসেবে দাবি করেছেন (৮টি পদ)।
  - **লুইপা:** প্রাচীনতম পদকার (১ম পদের রচয়িতা: *"কাআ তরুবর পঞ্চ বি ডাল"*).

### ২. মধ্যযুগের সাহিত্য ও রোমান্টিক প্রণয়োপাখ্যান
- **শাহ মুহম্মদ সগীর:** বাংলা সাহিত্যের প্রথম মুসলিম কবি (*ইউসুফ-জোলেখা*)।
- **আলাওল:** সপ্তদশ শতকের শ্রেষ্ঠ কবি (*পদ্মাবতী*, রোমান্টিক মহাকাব্য)।

> [!TIP]
> বিসিএস প্রিলিতে চর্যাপদের আবিষ্কারের সাল (১৯০৭) ও আবিষ্কারক (হরপ্রসাদ শাস্ত্রী) থেকে প্রতি বছর প্রশ্ন আসে।`;
      } else if (query.toLowerCase().includes('bank') || query.toLowerCase().includes('math') || query.toLowerCase().includes('profit')) {
        aiResponseText = `## Combined Bank Officer Math & Profit-Loss Shortcuts

### 1. Cost Price (CP) & Selling Price (SP) Magic Formula
- **Profit Percentage** = $\\frac{\\text{Selling Price} - \\text{Cost Price}}{\\text{Cost Price}} \\times 100\\%$
- **Shortcut for Successive Discounts ($d_1, d_2$):**
  $$\\text{Total Discount} = (d_1 + d_2) - \\frac{d_1 \\times d_2}{100}$$

### 2. Time & Work / Pipe-Cistern Key Rule
If Pipe A fills a tank in $X$ hours and Pipe B empties it in $Y$ hours:
$$\\text{Net Time to Fill Tank} = \\frac{X \\times Y}{Y - X} \\quad \\text{(where } Y > X \\text{)}$$

- **Example Question:** A pipe fills in 10 hrs and leak empties in 15 hrs.
  - Solution: $\\frac{10 \\times 15}{15 - 10} = \\frac{150}{5} = 30$ hours.`;
      } else if (query.toLowerCase().includes('it') || query.toLowerCase().includes('devops') || query.toLowerCase().includes('automation')) {
        aiResponseText = `## IT & Software Automation Study Note (BCC / BUET System Analyst)

### 1. CI/CD Pipeline & GitHub Actions Architecture
- **Continuous Integration (CI):** Automated linting, static analysis, unit test runs on every pull request.
- **Continuous Deployment (CD):** Automated container build (Docker image) and deployment to Kubernetes/Cloud.

\`\`\`yaml
name: Node.js CI Pipeline
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Tests
        run: npm test
\`\`\`

### 2. Microservices & System Design Essentials
- **Load Balancer:** Nginx / HAProxy distribution of traffic.
- **Database Caching:** Redis memory cache to achieve <10ms response times.`;
      } else if (query.toLowerCase().includes('spanish') || query.toLowerCase().includes('language')) {
        aiResponseText = `## Spoken Spanish & English Daily Conversation Guide

### Key Everyday Spanish Expressions
1. **¡Hola! ¿Cómo te va?** *(OH-lah, KOH-moh teh vah)*
   - Bangla: হ্যালো! কেমন চলছে আপনার?
   - English: Hello! How is it going?
2. **Me gustaría aprender español para mi trabajo.** *(Meh goo-stah-REE-ah ah-pren-DER es-pah-NYOL)*
   - Bangla: আমি আমার কাজের জন্য স্প্যানিশ শিখতে চাই।
   - English: I would like to learn Spanish for my work.
3. **Muchas gracias por su paciencia.**
   - Bangla: আপনার ধৈর্যের জন্য আপনাকে অনেক ধন্যবাদ।

### Spoken Tip
Practice repeating aloud 10 minutes every morning to build natural conversational fluency!`;
      } else {
        aiResponseText = `## BCS & Job Prep Custom Note: ${query}

- **Core Focus:** General Knowledge, Previous Year Questions (PYQ) analysis, and key formulas.
- **Bangla Summary:** এই বিষয়টি ৪৭তম বিসিএস এবং ব্যাংক সিনিয়র অফিসার পরীক্ষার জন্য অত্যন্ত গুরুত্বপূর্ণ।
- **Key Takeaway:** Regularly review flashcards and practice mock MCQs to retain concepts.`;
      }

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiResponseText,
        category_slug: targetCatId || categories[0]?.id,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 900);
  };

  const handleSaveToDb = async (msg: Message) => {
    const catId = msg.category_slug || (categories.length > 0 ? categories[0].id : '11111111-1111-1111-1111-111111111111');
    const firstLine = msg.text.split('\n')[0].replace(/[#*]/g, '').trim() || 'AI Generated Study Note';

    await createNote({
      category_id: catId,
      title: firstLine,
      bangla_title: firstLine,
      content: msg.text,
      tags: ['AI Generated', 'BCS Study', 'Auto Saved'],
      ai_generated: true,
    });

    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, saved_to_db: true } : m))
    );
    setSavedNotesCount((prev) => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>AI Automated Study & DB Saver Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            RIZON <span className="text-emerald-200">AI Assistant</span>
          </h1>
          <p className="text-xs text-emerald-100 max-w-lg leading-relaxed">
            Auto-generate study notes in Bangla/English for BCS, Bank Math, IT Automation, and Languages. 1-click save directly into your database.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-400/30 text-xs font-bold shrink-0">
          <Database className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-[10px] text-emerald-300 uppercase">Saved to DB</p>
            <p className="text-sm font-black text-white">{savedNotesCount} Notes Added</p>
          </div>
        </div>
      </div>

      {/* Preset Fast Action Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>Quick Generator Presets (Click to Generate & Auto Save)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt, item.category_id)}
              disabled={isGenerating}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-left transition-all hover:shadow-md group text-xs font-semibold space-y-1"
            >
              <div className="flex items-center justify-between text-emerald-700">
                <span className="font-extrabold line-clamp-1">{item.label}</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 font-sans">{item.prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[420px] flex flex-col justify-between space-y-6">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4.5 h-4.5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white font-semibold rounded-br-none shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-bl-none shadow-xs space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {msg.sender === 'ai' && msg.id !== 'welcome-1' && (
                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">BCS & Job Prep AI Model</span>
                    {msg.saved_to_db ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Saved to Database!</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSaveToDb(msg)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Save Note to DB</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-2xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md">
                  <User className="w-4.5 h-4.5" />
                </div>
              )}
            </div>
          ))}

          {isGenerating && (
            <div className="flex gap-3 items-center text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-2xl w-fit animate-pulse">
              <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>AI is generating structured BCS / Bank / IT study notes...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            placeholder="Ask AI to write study notes on any topic (Bangla or English)..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={isGenerating || !inputPrompt.trim()}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <span>Generate Note</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
