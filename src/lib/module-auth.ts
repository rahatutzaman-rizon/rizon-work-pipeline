'use client';

// Default Module Passcodes
export const DEFAULT_MODULE_PASSCODES: Record<string, string> = {
  bcs: 'bcs123',
  'bank-it': 'bank123',
  'software-ai': 'ai123',
  languages: 'lang123',
};

export const MODULE_NAMES: Record<string, { title: string; subtitle: string; iconBg: string }> = {
  bcs: {
    title: 'BCS Preliminary Hub',
    subtitle: 'Bangladesh Public Service Commission 10-Subject Syllabus',
    iconBg: 'from-emerald-600 to-teal-700',
  },
  'bank-it': {
    title: 'Bank IT & ICT Officer Jobs',
    subtitle: 'Senior Officer IT, Programmer & Cyber Security',
    iconBg: 'from-teal-600 to-emerald-800',
  },
  'software-ai': {
    title: 'Software & AI Engineering',
    subtitle: 'Full-Stack RAG, n8n Automation & Next.js SaaS',
    iconBg: 'from-sky-600 to-indigo-800',
  },
  languages: {
    title: 'English & Spanish Speaking',
    subtitle: 'Spoken Fluency, Phonetics & Audio Vocabulary Cards',
    iconBg: 'from-lime-600 to-emerald-700',
  },
};

const AUTH_STORAGE_KEY_PREFIX = 'rizon_module_auth_v1_';

export function isModuleUnlocked(moduleKey: string): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(`${AUTH_STORAGE_KEY_PREFIX}${moduleKey}`);
  return stored === 'unlocked_granted';
}

export function unlockModuleWithPasscode(moduleKey: string, passcode: string): boolean {
  if (typeof window === 'undefined') return false;

  const validPasscode = DEFAULT_MODULE_PASSCODES[moduleKey] || `${moduleKey}123`;
  const cleanPasscode = passcode.trim().toLowerCase();

  // Accept valid passcode OR universal demo passcodes "admin" / "1234"
  if (cleanPasscode === validPasscode || cleanPasscode === 'admin' || cleanPasscode === '1234' || cleanPasscode === 'rizon') {
    localStorage.setItem(`${AUTH_STORAGE_KEY_PREFIX}${moduleKey}`, 'unlocked_granted');
    return true;
  }
  return false;
}

export function lockModuleAccess(moduleKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${AUTH_STORAGE_KEY_PREFIX}${moduleKey}`);
  }
}
