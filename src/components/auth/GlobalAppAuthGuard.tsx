'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import {
  isGlobalAdminAuthenticated,
  authenticateGlobalAdmin,
} from '@/lib/global-auth';

interface GlobalAppAuthGuardProps {
  children: React.ReactNode;
}

export const GlobalAppAuthGuard: React.FC<GlobalAppAuthGuardProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const isGranted = isGlobalAdminAuthenticated();
    setAuthenticated(isGranted);
    setChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter portal password.');
      return;
    }

    const success = authenticateGlobalAdmin(password);
    if (success) {
      setErrorMsg('');
      setAuthenticated(true);
    } else {
      setErrorMsg('Invalid password. Access denied.');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-bold animate-pulse text-sm">
        Initializing RIZON Portal Authentication...
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden select-none">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-emerald-500/30 shadow-2xl p-8 sm:p-10 space-y-8 animate-fade-in text-white">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-lime-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 ring-4 ring-white/10">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin & Candidate Portal Guard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              RIZON <span className="text-emerald-400">Knowledge Platform</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Please enter access password to unlock the workspace
            </p>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Access Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter access password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-4 pr-10 py-3.5 bg-slate-950 border border-emerald-500/50 rounded-2xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition-all shadow-inner"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-2xl shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>Unlock RIZON Portal</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Security Badge Footer */}
          <div className="pt-3 text-center text-xs text-slate-400 border-t border-slate-800 flex items-center justify-center gap-1.5 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Protected Enterprise Portal • Encrypted Auth Session</span>
          </div>
        </form>
      </div>
    </div>
  );
};
