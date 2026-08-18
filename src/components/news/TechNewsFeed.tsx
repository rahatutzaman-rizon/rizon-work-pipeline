'use client';

import React, { useState } from 'react';
import { Newspaper, ExternalLink, Sparkles, Cpu, Bot, Terminal, Globe, ArrowUpRight, TrendingUp, Search } from 'lucide-react';

export interface TechNewsItem {
  id: string;
  title: string;
  category: 'AI & Automation' | 'Software Engineering' | 'BD ICT & Govt' | 'Tech Trends';
  snippet: string;
  source: string;
  published_at: string;
  read_time: string;
  url: string;
  image_url: string;
}

export const SAMPLE_TECH_NEWS: TechNewsItem[] = [
  {
    id: 'news-1',
    title: 'Bangladesh Govt Expands Smart ICT Infrastructure & AI Training Centers',
    category: 'BD ICT & Govt',
    snippet: 'BCC and Bangladesh ICT Division announce new nationwide training programs for software automation, DevOps pipelines, and AI engineering skills for job aspirants.',
    source: 'Bangladesh ICT Portal',
    published_at: 'Today',
    read_time: '3 min read',
    url: 'http://bcc.gov.bd',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'news-2',
    title: 'Python Automation & CI/CD Pipelines Required in modern IT Officer Recruitment',
    category: 'AI & Automation',
    snippet: 'BUET testing board adds DevOps scripting, Docker containerization, and Git GitHub Actions automation questions to IT Officer and System Analyst exam syllabi.',
    source: 'IT Exam Review',
    published_at: 'Yesterday',
    read_time: '4 min read',
    url: 'https://github.com/features/actions',
    image_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'news-3',
    title: 'AI Code Assistants (LLM Agents) Revolutionize Enterprise Software Engineering',
    category: 'Software Engineering',
    snippet: 'How autonomous LLM coding assistants and RAG architectures are transforming software maintenance, automated unit test generation, and database optimization.',
    source: 'TechCrunch / IEEE',
    published_at: '2 days ago',
    read_time: '5 min read',
    url: 'https://news.ycombinator.com',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'news-4',
    title: 'Spanish & English Bilingual Advantage in Global Tech & Remote IT Engineering Jobs',
    category: 'Tech Trends',
    snippet: 'Global remote tech platforms highlight a 35% salary premium for bilingual software engineers proficient in spoken English and Spanish for multinational team collaboration.',
    source: 'Global Remote Work Index',
    published_at: '3 days ago',
    read_time: '4 min read',
    url: 'https://duolingo.com',
    image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  },
];

export const TechNewsFeed: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filteredNews = SAMPLE_TECH_NEWS.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.snippet.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>Live Industry & ICT News Feed</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">Recent Tech & IT News</h3>
          <p className="text-xs text-slate-500">Stay updated on Bangladesh ICT circulars, AI automation trends, and software engineering news.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tech news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {['All', 'AI & Automation', 'Software Engineering', 'BD ICT & Govt', 'Tech Trends'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedCat === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="group rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 bg-white"
          >
            <div className="space-y-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-100">
                <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold">
                  {news.category}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-emerald-700">{news.source}</span>
                <span>{news.published_at} · {news.read_time}</span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                {news.title}
              </h4>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {news.snippet}
              </p>
            </div>

            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <span>Read Full Article</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
