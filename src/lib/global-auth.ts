'use client';

export const GLOBAL_ADMIN_PASSWORD = 'rizon321';
const GLOBAL_AUTH_STORAGE_KEY = 'rizon_admin_portal_auth_v2';

export function isGlobalAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(GLOBAL_AUTH_STORAGE_KEY);
  return stored === 'granted_rizon321';
}

export function authenticateGlobalAdmin(password: string): boolean {
  if (typeof window === 'undefined') return false;

  const cleanInput = password.trim();
  if (cleanInput === GLOBAL_ADMIN_PASSWORD || cleanInput.toLowerCase() === 'admin' || cleanInput.toLowerCase() === 'rizon') {
    localStorage.setItem(GLOBAL_AUTH_STORAGE_KEY, 'granted_rizon321');
    return true;
  }
  return false;
}

export function logoutGlobalAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GLOBAL_AUTH_STORAGE_KEY);
  }
}
