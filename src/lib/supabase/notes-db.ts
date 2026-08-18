import { NoteItem } from '@/types';
import { createClient, isSupabaseConfigured } from './client';

export const INITIAL_NOTES: NoteItem[] = [];

const LOCAL_NOTES_KEY = 'rizon_notes_supabase_v2';

export function getLocalNotes(): NoteItem[] {
  if (typeof window === 'undefined') return INITIAL_NOTES;
  const stored = localStorage.getItem(LOCAL_NOTES_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(INITIAL_NOTES));
    return INITIAL_NOTES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveLocalNotes(notes: NoteItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(notes));
  }
}

export async function fetchNotes(): Promise<NoteItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as NoteItem[];
      }
    } catch (e) {
      console.warn('Supabase fetchNotes error:', e);
    }
  }
  return getLocalNotes();
}

export async function createNote(input: {
  category_id: string;
  title: string;
  bangla_title?: string;
  content: string;
  tags?: string[];
  image_urls?: string[];
  pdf_url?: string;
  ai_generated?: boolean;
}): Promise<NoteItem> {
  const newNote: NoteItem = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`,
    category_id: input.category_id,
    title: input.title.trim(),
    bangla_title: input.bangla_title?.trim(),
    content: input.content,
    tags: input.tags || ['BCS'],
    image_urls: input.image_urls || [],
    pdf_url: input.pdf_url,
    is_pinned: false,
    ai_generated: input.ai_generated || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const payload = {
        title: input.title.trim(),
        content: input.content,
      };

      const { data, error } = await supabase.from('notes').insert([payload]).select().single();
      if (!error && data) {
        return {
          ...newNote,
          id: data.id || newNote.id,
        };
      }
      console.warn('Supabase createNote insert failed (RLS/schema lock), using optimistic local save:', error?.message);
    } catch (e) {
      console.warn('Supabase createNote exception, using optimistic local save:', e);
    }
  }

  const current = getLocalNotes();
  const updated = [newNote, ...current];
  saveLocalNotes(updated);
  return newNote;
}

export async function deleteNote(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('notes').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteNote error:', e);
    }
  }

  const current = getLocalNotes();
  const updated = current.filter((n) => n.id !== id);
  saveLocalNotes(updated);
  return true;
}
