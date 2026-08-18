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
  Landmark,
  Building2,
  Terminal,
  Languages,
} from 'lucide-react';
import {
  isModuleUnlocked,
  unlockModuleWithPasscode,
  MODULE_NAMES,
} from '@/lib/module-auth';

interface ModuleAuthGuardProps {
  moduleKey: 'bcs' | 'bank-it' | 'software-ai' | 'languages';
  children: React.ReactNode;
}

const MODULE_ICONS = {
  bcs: Landmark,
  'bank-it': Building2,
  'software-ai': Terminal,
  languages: Languages,
};

export const ModuleAuthGuard: React.FC<ModuleAuthGuardProps> = ({ moduleKey, children }) => {
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [checking, setChecking] = useState<boolean>(true);

  const moduleInfo = MODULE_NAMES[moduleKey] || {
    title: `${moduleKey.toUpperCase()} Module`,
    subtitle: 'Module Permission Access Guard',
    iconBg: 'from-emerald-600 to-teal-700',
  };

  const IconComp = MODULE_ICONS[moduleKey] || GraduationCap;

  useEffect(() => {
    const isGranted = isModuleUnlocked(moduleKey);
    setUnlocked(isGranted);
    setChecking(false);
  }, [moduleKey]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Please enter module passcode to gain permission.');
      return;
    }

    const success = unlockModuleWithPasscode(moduleKey, passcode);
    if (success) {
      setErrorMsg('');
      setUnlocked(true);
    } else {
      setErrorMsg('Invalid passcode. Access denied.');
    }
  };

  if (checking) {
    return (
      <div className="p-12 text-center text-slate-500 font-bold animate-pulse">
        Checking Module Permissions...
      </div>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in space-y-8">
      {/* LOCK HERO CARD */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-emerald-500/30 space-y-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${moduleInfo.iconBg} text-white flex items-center justify-center shadow-2xl shrink-0 ring-4 ring-white/10`}>
            <IconComp className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Permission Protected Module</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{moduleInfo.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">{moduleInfo.subtitle}</p>
          </div>
        </div>

        {/* PASSCODE FORM */}
        <form onSubmit={handleUnlock} className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/15 space-y-5 max-w-md mx-auto shadow-xl">
          <div className="space-y-1 text-center">
            <h3 className="text-base font-extrabold text-white flex items-center justify-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Enter Module Passcode</span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Provide password authorization to access notes, exams & topics
            </p>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-4 pr-10 py-3 bg-slate-900/80 border border-emerald-500/40 rounded-2xl text-xs font-mono font-bold text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Unlock Module Permission</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-white/10 font-sans flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Secure Access Module</span>
          </div>
        </form>
      </div>
    </div>
  );
};
