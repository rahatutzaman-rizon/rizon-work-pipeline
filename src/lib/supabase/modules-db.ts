import { createClient, isSupabaseConfigured } from './client';

export type ModuleType = 'bcs' | 'bank-it' | 'software-ai' | 'languages';

export interface SubjectItem {
  id: string;
  module: ModuleType;
  slug: string;
  name_en: string;
  name_bn?: string;
  marks?: number;
  sort_order: number;
  created_at: string;
}

export interface NoteAttachment {
  type: 'image' | 'pdf';
  url: string;
  name?: string;
}

export interface NoteItem {
  id: string;
  module: ModuleType;
  subject_id: string;
  title: string;
  title_bn?: string;
  content: string;
  tags?: string[];
  attachments?: NoteAttachment[];
  image_urls?: string[];
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskItem {
  id: string;
  module: ModuleType;
  subject_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  due_date?: string;
  checklist?: { text: string; done: boolean }[];
  created_at: string;
  updated_at: string;
}

export interface CommentItem {
  id: string;
  parent_type: 'note' | 'task';
  parent_id: string;
  body: string;
  created_at: string;
}

export interface VocabSetItem {
  id: string;
  language: 'english' | 'spanish';
  slug: string;
  title: string;
}

export interface VocabCardItem {
  id: string;
  set_id: string;
  word: string;
  meaning_bn: string;
  example_sentence?: string;
  audio_url?: string;
  created_at: string;
}

function isValidUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// ----------------------------------------------------
// BROWSER LOCAL STORAGE PERSISTENCE KEYS
// ----------------------------------------------------
const LOCAL_MODULE_NOTES_KEY = 'rizon_module_notes_v4';
const LOCAL_MODULE_TASKS_KEY = 'rizon_module_tasks_v4';

function getLocalNotes(): NoteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_MODULE_NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalNotes(notes: NoteItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_MODULE_NOTES_KEY, JSON.stringify(notes));
  }
}

function getLocalTasks(): TaskItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_MODULE_TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalTasks(tasks: TaskItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_MODULE_TASKS_KEY, JSON.stringify(tasks));
  }
}

// ----------------------------------------------------
// DEFAULT SEED SUBJECTS
// ----------------------------------------------------
export const DEFAULT_BCS_SUBJECTS: Omit<SubjectItem, 'id' | 'created_at'>[] = [
  { module: 'bcs', slug: 'bangla', name_en: 'Bangla Language & Literature', name_bn: 'বাংলা ভাষা ও সাহিত্য', marks: 30, sort_order: 1 },
  { module: 'bcs', slug: 'english', name_en: 'English Language & Literature', name_bn: 'English Language & Literature', marks: 30, sort_order: 2 },
  { module: 'bcs', slug: 'bangladesh-affairs', name_en: 'Bangladesh Affairs', name_bn: 'বাংলাদেশ বিষয়াবলি', marks: 30, sort_order: 3 },
  { module: 'bcs', slug: 'international-affairs', name_en: 'International Affairs', name_bn: 'আন্তর্জাতিক বিষয়াবলি', marks: 20, sort_order: 4 },
  { module: 'bcs', slug: 'geography', name_en: 'Geography & Disaster Management', name_bn: 'ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা', marks: 10, sort_order: 5 },
  { module: 'bcs', slug: 'general-science', name_en: 'General Science', name_bn: 'সাধারণ বিজ্ঞান', marks: 15, sort_order: 6 },
  { module: 'bcs', slug: 'computer-it', name_en: 'Computer & IT', name_bn: 'কম্পিউটার ও তথ্যপ্রযুক্তি', marks: 15, sort_order: 7 },
  { module: 'bcs', slug: 'mathematics', name_en: 'Mathematical Reasoning', name_bn: 'গাণিতিক যুক্তি', marks: 15, sort_order: 8 },
  { module: 'bcs', slug: 'mental-ability', name_en: 'Mental Ability', name_bn: 'মানসিক দক্ষতা', marks: 15, sort_order: 9 },
  { module: 'bcs', slug: 'ethics-governance', name_en: 'Ethics & Good Governance', name_bn: 'নৈতিকতা, মূল্যবোধ ও সুশাসন', marks: 10, sort_order: 10 },
];

export const DEFAULT_BANK_IT_SUBJECTS: Omit<SubjectItem, 'id' | 'created_at'>[] = [
  { module: 'bank-it', slug: 'computer-fundamentals', name_en: 'Computer Fundamentals', name_bn: 'কম্পিউটার মৌলিক ধারণা', marks: 15, sort_order: 1 },
  { module: 'bank-it', slug: 'operating-systems', name_en: 'Operating Systems & System Admin', name_bn: 'অপারেটিং সিস্টেমস', marks: 15, sort_order: 2 },
  { module: 'bank-it', slug: 'programming', name_en: 'Programming & Data Structures', name_bn: 'প্রোগ্রামিং ও অ্যালগরিদম', marks: 20, sort_order: 3 },
  { module: 'bank-it', slug: 'database-systems', name_en: 'Database Systems & SQL', name_bn: 'ডাটাবেজ সিস্টেমস', marks: 20, sort_order: 4 },
  { module: 'bank-it', slug: 'networking', name_en: 'Computer Networking & Protocols', name_bn: 'কম্পিউটার নেটওয়ার্কিং', marks: 15, sort_order: 5 },
  { module: 'bank-it', slug: 'cyber-security', name_en: 'Cyber Security & ICT Risk', name_bn: 'সাইবার সিকিউরিটি', marks: 15, sort_order: 6 },
  { module: 'bank-it', slug: 'software-engineering', name_en: 'Software Engineering & SDLC', name_bn: 'সফটওয়্যার ইঞ্জিনিয়ারিং', marks: 15, sort_order: 7 },
  { module: 'bank-it', slug: 'banking-technology', name_en: 'Banking Technology & Payment Systems', name_bn: 'ব্যাংকিং টেকনোলজি ও পেমেন্ট', marks: 15, sort_order: 8 },
];

export const DEFAULT_SOFTWARE_AI_SUBJECTS: Omit<SubjectItem, 'id' | 'created_at'>[] = [
  { module: 'software-ai', slug: 'dsa', name_en: 'Data Structures & Algorithms', name_bn: 'ডাটা স্ট্রাকচার ও অ্যালগরিদম', sort_order: 1 },
  { module: 'software-ai', slug: 'system-design', name_en: 'System Design & Architecture', name_bn: 'সিস্টেম ডিজাইন', sort_order: 2 },
  { module: 'software-ai', slug: 'nextjs-nodejs', name_en: 'Next.js & Node.js Microservices', name_bn: 'নেক্সট ডট জেএস ও নোড জেএস', sort_order: 3 },
  { module: 'software-ai', slug: 'docker-cicd', name_en: 'Docker, DevOps & CI/CD Pipelines', name_bn: 'ডকার ও সিআই/সিডি', sort_order: 4 },
  { module: 'software-ai', slug: 'ai-agents-rag', name_en: 'AI Agents, Vector DB & RAG Architecture', name_bn: 'এআই এজেন্ট ও আরএজি', sort_order: 5 },
  { module: 'software-ai', slug: 'n8n-automation', name_en: 'n8n Workflow Automation', name_bn: 'n8n ওয়ার্কফ্লো অটোমেশন', sort_order: 6 },
  { module: 'software-ai', slug: 'multitenant-saas', name_en: 'Multi-tenant SaaS & ERP Architecture', name_bn: 'মাল্টি-টেন্যান্ট স্যাশ আর্কিটেকচার', sort_order: 7 },
];

// ----------------------------------------------------
// SUBJECT API
// ----------------------------------------------------
export async function fetchSubjectsByModule(mod: ModuleType): Promise<SubjectItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('subjects').select('*');
      if (!error && data && data.length > 0) {
        const filtered = data.filter((s: any) => s.module === mod);
        if (filtered.length > 0) return filtered as SubjectItem[];
      }
    } catch (err) {
      console.warn('fetchSubjectsByModule error:', err);
    }
  }

  let defaults: Omit<SubjectItem, 'id' | 'created_at'>[] = [];
  if (mod === 'bcs') defaults = DEFAULT_BCS_SUBJECTS;
  else if (mod === 'bank-it') defaults = DEFAULT_BANK_IT_SUBJECTS;
  else if (mod === 'software-ai') defaults = DEFAULT_SOFTWARE_AI_SUBJECTS;

  return defaults.map((d) => ({
    id: `seed-${d.module}-${d.slug}`,
    ...d,
    created_at: new Date().toISOString(),
  }));
}

export async function fetchSubjectBySlug(mod: ModuleType, slug: string): Promise<SubjectItem | null> {
  const subjects = await fetchSubjectsByModule(mod);
  return subjects.find((s) => s.slug === slug) || null;
}

// ----------------------------------------------------
// NOTES API (Strictly Scoped by Module & Subject)
// ----------------------------------------------------
export async function fetchNotesBySubject(mod: ModuleType, subjectId: string): Promise<NoteItem[]> {
  const localNotes = getLocalNotes();
  const filteredLocal = localNotes.filter(
    (n) => n.module === mod && (n.subject_id === subjectId || (n as any).subject_slug === subjectId || (n as any).category_id === subjectId)
  );

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });

      if (!error && data) {
        const dbFiltered = data.filter((item: any) => {
          if (item.module && item.module !== mod) return false;
          const itemSubject = item.subject_id || item.category_id || item.subject_slug;
          if (itemSubject) {
            return itemSubject === subjectId || itemSubject.includes(subjectId) || subjectId.includes(itemSubject);
          }
          return false; // Strictly exclude un-scoped items
        }) as NoteItem[];

        const combined = [...dbFiltered, ...filteredLocal];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return unique;
      }
    } catch (err) {
      console.warn('fetchNotesBySubject error:', err);
    }
  }

  return filteredLocal;
}

export async function fetchNoteById(id: string): Promise<NoteItem | null> {
  const localNotes = getLocalNotes();
  const foundLocal = localNotes.find((n) => n.id === id);
  if (foundLocal) return foundLocal;

  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    if (!error && data) return data as NoteItem;
  } catch (err) {
    console.warn('fetchNoteById error:', err);
  }
  return null;
}

export async function createNote(input: {
  module: ModuleType;
  subject_id: string;
  title: string;
  title_bn?: string;
  content: string;
  tags?: string[];
  attachments?: NoteAttachment[];
}): Promise<NoteItem | null> {
  const createdNote: NoteItem = {
    id: `note-${Date.now()}`,
    module: input.module,
    subject_id: input.subject_id,
    title: input.title.trim(),
    title_bn: input.title_bn?.trim(),
    content: input.content,
    tags: input.tags || [],
    attachments: input.attachments || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const categoryUuid = isValidUUID(input.subject_id) ? input.subject_id : null;

      const payload: any = {
        title: input.title.trim(),
        content: input.content,
      };
      if (categoryUuid) payload.category_id = categoryUuid;
      if (input.title_bn) payload.title_bn = input.title_bn.trim();

      const { data, error } = await supabase.from('notes').insert([payload]).select().single();
      if (!error && data) {
        const dbNote: NoteItem = {
          ...createdNote,
          id: data.id || createdNote.id,
        };
        saveLocalNotes([dbNote, ...getLocalNotes()]);
        return dbNote;
      }
    } catch (err) {
      console.warn('createNote Supabase insert warning:', err);
    }
  }

  saveLocalNotes([createdNote, ...getLocalNotes()]);
  return createdNote;
}

export async function deleteNote(id: string): Promise<boolean> {
  const currentLocal = getLocalNotes();
  saveLocalNotes(currentLocal.filter((n) => n.id !== id));

  if (!isSupabaseConfigured()) return true;
  try {
    const supabase = createClient();
    const { error } = await supabase.from('notes').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('deleteNote error:', err);
    return false;
  }
}

// ----------------------------------------------------
// TASKS API (Strictly Scoped by Module & Subject)
// ----------------------------------------------------
export async function fetchTasksBySubject(mod: ModuleType, subjectId: string): Promise<TaskItem[]> {
  const localTasks = getLocalTasks();
  const filteredLocal = localTasks.filter(
    (t) => t.module === mod && (t.subject_id === subjectId || (t as any).category_id === subjectId)
  );

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });

      if (!error && data) {
        const dbFiltered = data.filter((item: any) => {
          if (item.module && item.module !== mod) return false;
          const itemSubject = item.subject_id || item.category_id || item.subject_slug;
          if (itemSubject) {
            return itemSubject === subjectId || itemSubject.includes(subjectId) || subjectId.includes(itemSubject);
          }
          return false; // Strictly exclude un-scoped tasks
        }) as TaskItem[];

        const combined = [...dbFiltered, ...filteredLocal];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return unique;
      }
    } catch (err) {
      console.warn('fetchTasksBySubject error:', err);
    }
  }

  return filteredLocal;
}

export async function fetchTaskById(id: string): Promise<TaskItem | null> {
  const localTasks = getLocalTasks();
  const foundLocal = localTasks.find((t) => t.id === id);
  if (foundLocal) return foundLocal;

  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
    if (!error && data) return data as TaskItem;
  } catch (err) {
    console.warn('fetchTaskById error:', err);
  }
  return null;
}

export async function createTask(input: {
  module: ModuleType;
  subject_id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  checklist?: { text: string; done: boolean }[];
}): Promise<TaskItem | null> {
  const createdTask: TaskItem = {
    id: `task-${Date.now()}`,
    module: input.module,
    subject_id: input.subject_id,
    title: input.title.trim(),
    description: input.description?.trim(),
    priority: input.priority || 'medium',
    status: 'todo',
    due_date: input.due_date,
    checklist: input.checklist || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const categoryUuid = isValidUUID(input.subject_id) ? input.subject_id : null;

      const payload: any = {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        priority: input.priority || 'medium',
        status: 'todo',
      };
      if (categoryUuid) payload.category_id = categoryUuid;

      const { data, error } = await supabase.from('tasks').insert([payload]).select().single();
      if (!error && data) {
        const dbTask: TaskItem = {
          ...createdTask,
          id: data.id || createdTask.id,
        };
        saveLocalTasks([dbTask, ...getLocalTasks()]);
        return dbTask;
      }
    } catch (err) {
      console.warn('createTask Supabase insert warning:', err);
    }
  }

  saveLocalTasks([createdTask, ...getLocalTasks()]);
  return createdTask;
}

export async function updateTaskStatus(id: string, status: 'todo' | 'in_progress' | 'done'): Promise<boolean> {
  const currentLocal = getLocalTasks();
  saveLocalTasks(currentLocal.map((t) => (t.id === id ? { ...t, status } : t)));

  if (!isSupabaseConfigured()) return true;
  try {
    const supabase = createClient();
    const { error } = await supabase.from('tasks').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    return !error;
  } catch (err) {
    console.error('updateTaskStatus error:', err);
    return false;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  const currentLocal = getLocalTasks();
  saveLocalTasks(currentLocal.filter((t) => t.id !== id));

  if (!isSupabaseConfigured()) return true;
  try {
    const supabase = createClient();
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('deleteTask error:', err);
    return false;
  }
}

// ----------------------------------------------------
// COMMENTS API
// ----------------------------------------------------
export async function fetchComments(parentType: 'note' | 'task', parentId: string): Promise<CommentItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('parent_type', parentType)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (!error && data) return data as CommentItem[];
  } catch (err) {
    console.warn('fetchComments error:', err);
  }
  return [];
}

export async function createComment(parentType: 'note' | 'task', parentId: string, body: string): Promise<CommentItem | null> {
  if (!body.trim()) return null;
  const createdComment: CommentItem = {
    id: `comment-${Date.now()}`,
    parent_type: parentType,
    parent_id: parentId,
    body: body.trim(),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const payload = {
        parent_type: parentType,
        parent_id: parentId,
        body: body.trim(),
      };
      const { data, error } = await supabase.from('comments').insert([payload]).select().single();
      if (!error && data) return data as CommentItem;
    } catch (err) {
      console.error('createComment error:', err);
    }
  }

  return createdComment;
}

// ----------------------------------------------------
// VOCABULARY API
// ----------------------------------------------------
export async function fetchVocabSets(language: 'english' | 'spanish'): Promise<VocabSetItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('vocab_sets')
        .select('*')
        .eq('language', language);

      if (!error && data && data.length > 0) {
        return data as VocabSetItem[];
      }
    } catch (err) {
      console.warn('fetchVocabSets error:', err);
    }
  }

  if (language === 'english') {
    return [
      { id: 'seed-en-1', language: 'english', slug: 'daily-conversation', title: 'Daily Conversational Phrases' },
      { id: 'seed-en-2', language: 'english', slug: 'job-interview', title: 'Job Interview & Corporate Vocabulary' },
    ];
  } else {
    return [
      { id: 'seed-es-1', language: 'spanish', slug: 'basic-phrases', title: 'Basic Spanish Daily Greetings' },
      { id: 'seed-es-2', language: 'spanish', slug: 'intermediate-vocab', title: 'Intermediate Spanish Travel & Work' },
    ];
  }
}

export async function fetchVocabCards(setId: string): Promise<VocabCardItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('vocab_cards')
      .select('*')
      .eq('set_id', setId)
      .order('created_at', { ascending: true });

    if (!error && data) return data as VocabCardItem[];
  } catch (err) {
    console.warn('fetchVocabCards error:', err);
  }
  return [];
}
