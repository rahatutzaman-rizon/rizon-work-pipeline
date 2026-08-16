# Rizon Work Pipeline — Personal Study & Knowledge Platform

A unified personal Study + Knowledge + Task Management workspace powered by AI agents and relational knowledge graphs.

## Category Hierarchy & Knowledge Graph

Everything is connected through a knowledge graph:
Category → Study Topic → Tasks / Notes / Documents → Projects → AI Agents

Opening any topic (e.g. "RAG") shows progress %, related notes, documents, tasks, projects, resources, and AI agent history in one place.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React, TanStack Query, Zustand, React Hook Form, Zod
- **Backend**: Supabase PostgreSQL, Row Level Security (RLS), `pgvector` extension
- **Deployment**: Vercel ready

## Features (Phase 1 Complete)

- [x] Next.js 15 App Router & Dark Glassmorphic Design System
- [x] Unlimited Nested Categories (`parent_id`) with dynamic color & icon picker
- [x] Supabase database schema with RLS policies & `pgvector`
- [x] Sidebar navigation across Dashboard, Workspace, Study Domains, Knowledge, AI Agents, Analytics, and Settings

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/rahatutzaman-rizon/rizon-work-pipeline.git
   cd rizon-work-pipeline
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
