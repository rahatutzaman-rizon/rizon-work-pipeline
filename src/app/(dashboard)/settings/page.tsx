'use client';

import React from 'react';
import { Settings, Database, Key, ShieldCheck, User } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function SettingsPage() {
  const supabaseActive = isSupabaseConfigured();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Settings</h1>
        <p className="text-xs text-slate-400">
          Manage user profile, Supabase connection status, and AI agent keys.
        </p>
      </div>

      {/* Supabase Status Card */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Supabase PostgreSQL Connection</h3>
              <p className="text-xs text-slate-400">
                Database schema with RLS and pgvector vector search support
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              supabaseActive
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{supabaseActive ? 'Supabase Live' : 'Local Persistence Mode (Dev)'}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {supabaseActive
            ? 'Connected to live Supabase backend. Row level security and real-time syncing enabled.'
            : 'Running in resilient local dev state. To connect to Supabase, update .env.local with your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY credentials.'}
        </p>
      </div>
    </div>
  );
}
