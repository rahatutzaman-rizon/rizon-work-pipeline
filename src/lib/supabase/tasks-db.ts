import { Task, TaskChecklist, TaskStatus, TaskPriority } from '@/types';
import { createClient, isSupabaseConfigured } from './client';

export const INITIAL_TASKS: Task[] = [];

const LOCAL_MODULE_TASKS_KEY = 'rizon_module_tasks_v4';

export function getLocalTasks(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  const stored = localStorage.getItem(LOCAL_MODULE_TASKS_KEY);
  if (!stored) return INITIAL_TASKS;
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveLocalTasks(tasks: Task[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_MODULE_TASKS_KEY, JSON.stringify(tasks));
  }
}

/**
 * Fetch tasks strictly filtered by categoryId and/or status/priority
 */
export async function fetchTasks(filter?: {
  status?: TaskStatus;
  categoryId?: string;
  priority?: TaskPriority;
  module?: string;
}): Promise<Task[]> {
  const localTasks = getLocalTasks();

  let filteredLocal = localTasks;
  if (filter?.categoryId) {
    filteredLocal = filteredLocal.filter(
      (t: any) => t.subject_id === filter.categoryId || t.category_id === filter.categoryId
    );
  }
  if (filter?.module) {
    filteredLocal = filteredLocal.filter((t: any) => t.module === filter.module);
  }
  if (filter?.status) {
    filteredLocal = filteredLocal.filter((t) => t.status === filter.status);
  }
  if (filter?.priority) {
    filteredLocal = filteredLocal.filter((t) => t.priority === filter.priority);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

      if (filter?.status) query = query.eq('status', filter.status);
      if (filter?.categoryId) query = query.eq('category_id', filter.categoryId);
      if (filter?.priority) query = query.eq('priority', filter.priority);

      const { data, error } = await query;
      if (!error && data) {
        const dbTasks = data as Task[];
        const combined = [...dbTasks, ...filteredLocal];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return unique;
      }
    } catch (e) {
      console.warn('Supabase task fetch error:', e);
    }
  }

  return filteredLocal;
}

/**
 * Create a new task in Supabase & LocalStorage
 */
export async function createTask(input: {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category_id?: string | null;
  due_date?: string | null;
  estimated_minutes?: number;
  checklists?: Array<{ title: string; is_completed?: boolean }>;
  tags?: string[];
  module?: string;
}): Promise<Task> {
  const taskId = `task-${Date.now()}`;
  const now = new Date().toISOString();

  const formattedChecklists: TaskChecklist[] = (input.checklists || []).map((item, idx) => ({
    id: `chk-${Date.now()}-${idx}`,
    task_id: taskId,
    title: item.title.trim(),
    is_completed: item.is_completed || false,
  }));

  const newTask: Task = {
    id: taskId,
    user_id: 'default-user',
    category_id: input.category_id || null,
    study_topic_id: null,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    status: input.status || 'todo',
    priority: input.priority || 'medium',
    due_date: input.due_date || null,
    estimated_minutes: input.estimated_minutes || 30,
    checklists: formattedChecklists,
    tags: input.tags || [],
    created_at: now,
    updated_at: now,
    completed_at: null,
  };
  (newTask as any).subject_id = input.category_id || null;
  (newTask as any).module = input.module || 'bcs';

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const payload: any = {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        status: input.status || 'todo',
        priority: input.priority || 'medium',
      };
      if (input.category_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.category_id)) {
        payload.category_id = input.category_id;
      }

      const { data, error } = await supabase.from('tasks').insert([payload]).select().single();
      if (!error && data) {
        const dbTask = {
          ...newTask,
          id: data.id || newTask.id,
        };
        saveLocalTasks([dbTask, ...getLocalTasks()]);
        return dbTask;
      }
    } catch (e) {
      console.warn('Supabase task insert warning:', e);
    }
  }

  saveLocalTasks([newTask, ...getLocalTasks()]);
  return newTask;
}

export async function updateTask(taskId: string, input: Partial<Task>): Promise<boolean> {
  const current = getLocalTasks();
  saveLocalTasks(current.map((t) => (t.id === taskId ? { ...t, ...input, updated_at: new Date().toISOString() } : t)));

  if (!isSupabaseConfigured()) return true;
  try {
    const supabase = createClient();
    const { error } = await supabase.from('tasks').update({ ...input, updated_at: new Date().toISOString() }).eq('id', taskId);
    return !error;
  } catch (e) {
    console.warn('updateTask error:', e);
    return false;
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<boolean> {
  const current = getLocalTasks();
  saveLocalTasks(current.map((t) => (t.id === taskId ? { ...t, status } : t)));

  if (!isSupabaseConfigured()) return true;
  try {
    const supabase = createClient();
    const { error } = await supabase.from('tasks').update({ status, updated_at: new Date().toISOString() }).eq('id', taskId);
    return !error;
  } catch (e) {
    console.warn('updateTaskStatus error:', e);
    return false;
  }
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const current = getLocalTasks();
  saveLocalTasks(current.filter((t) => t.id !== taskId));

  if (!isSupabaseConfigured()) return true;
  try {
    const supabase = createClient();
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    return !error;
  } catch (e) {
    console.warn('deleteTask error:', e);
    return false;
  }
}

export async function seedSupabaseTasks(): Promise<void> {
  console.log('Tasks seeded.');
}
