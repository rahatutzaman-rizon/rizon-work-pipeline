'use client';

import React from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Terminal,
  Cpu,
  Bot,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  CheckCircle2,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';

export const RizonPortfolioCv: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl space-y-8 animate-fade-in">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-emerald-100">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            RR
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Stack & AI Automation Engineer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Rahatutzaman Rizon
            </h1>
            <p className="text-xs sm:text-sm text-emerald-700 font-bold mt-0.5">
              ERP | SaaS | CRM | B2B | AI & n8n Workflow Automation
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> Dhaka, Bangladesh</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-emerald-600" /> rizonrahat199@gmail.com</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-600" /> +880 1771-276400</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-sky-700 transition-colors shadow-xs"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-emerald-900 flex items-center gap-1.5">
          <User className="w-4 h-4 text-emerald-600" />
          <span>Professional Summary</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium">
          Full Stack Software Engineer with 2+ years building and scaling multi-tenant ERP, CRM, SaaS, B2B, booking, payment, and Shopify platforms. Skilled in JavaScript, TypeScript, React.js, Next.js, Node.js, MongoDB, SQL, REST APIs, Docker, and <strong>n8n workflow & AI/RAG automation</strong> for real-world clients.
        </p>
      </div>

      {/* Technical Skills Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-600" />
          <span>Technical Skills & AI Automation Stack</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1">
              <Bot className="w-4 h-4 text-emerald-600" /> AI & Automation
            </span>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              <strong>n8n Workflow Automation</strong>, AI Agents, RAG Architecture, Document Retrieval, Claude, Antigravity, LLM Pipeline Automation
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1">
              <Terminal className="w-4 h-4 text-emerald-600" /> Core Languages & Web
            </span>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              TypeScript, JavaScript, Python, SQL, C++, HTML5, CSS3, Tailwind CSS, Framer Motion
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1">
              <Layers className="w-4 h-4 text-emerald-600" /> Full Stack Frameworks
            </span>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              React.js, Next.js, Node.js, Express.js, Redux, REST APIs, JWT, RBAC, Microservices
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1">
              <Cpu className="w-4 h-4 text-emerald-600" /> Databases & Storage
            </span>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              MongoDB, PostgreSQL, MySQL, Mongoose, Schema Design, Query Optimization
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1">
              <Zap className="w-4 h-4 text-emerald-600" /> DevOps & Deployment
            </span>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              Docker, Git, GitHub Actions, CI/CD Pipelines, Azure DevOps, Postman API Testing
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1">
              <Award className="w-4 h-4 text-emerald-600" /> Problem Solving & CS
            </span>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              500+ solved problems across LeetCode, CodeChef & Beecrowd. OOP, DSA, System Design.
            </p>
          </div>
        </div>
      </div>

      {/* Professional Experience */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          <span>Professional Experience</span>
        </h3>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="text-sm font-black text-slate-900">Software Engineer — Implevista</h4>
                <p className="text-xs text-emerald-700 font-bold">Multi-tenant Travel ERP & AI Workflows</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">Dec 2024 – Present</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside leading-relaxed font-sans">
              <li>Architected multi-tenant ERP logic, RBAC, authentication, flight/hotel booking, payment, and refund workflows.</li>
              <li>Contributed to AI/RAG-based document retrieval and workflow automation for real-world client platforms.</li>
              <li>Owned CI/CD pipelines, Docker containerization, Azure DevOps, and production deployment.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="text-sm font-black text-slate-900">Junior Software Developer — JMC Technology Ltd</h4>
                <p className="text-xs text-emerald-700 font-bold">ERP / CRM & Shopify Solutions</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">Jun 2024 – Nov 2024</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              Developed ERP/CRM features, Shopify solutions, React interfaces, and REST APIs using React.js, Node.js, Express.js, and MongoDB.
            </p>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span>B.Sc. in Information and Communication Technology (ICT)</span>
          </div>
          <p className="text-xs text-slate-600">Mawlana Bhashani Science and Technology University (MBSTU)</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            CGPA: 3.50 / 4.00
          </span>
          <p className="text-[11px] font-mono text-slate-400 mt-1">2019 – 2024</p>
        </div>
      </div>
    </div>
  );
};
