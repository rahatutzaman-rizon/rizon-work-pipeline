import { Task, TaskChecklist, TaskStatus, TaskPriority } from '@/types';
import { createClient, isSupabaseConfigured } from './client';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    user_id: 'default-user',
    category_id: 'cat-ai-rag', // Linked to RAG Architecture!
    study_topic_id: null,
    title: 'Implement RAG Vector Database Indexing',
    description: 'Set up pgvector extension and chunk embedding pipeline for study document notes.',
    status: 'in_progress',
    priority: 'high',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    estimated_minutes: 60,
    completed_at: null,
    checklists: [
      { id: 'chk-1', task_id: 'task-1', title: 'Create vector extension in Supabase', is_completed: true },
      { id: 'chk-2', task_id: 'task-1', title: 'Configure chunking strategy for notes', is_completed: false },
      { id: 'chk-3', task_id: 'task-1', title: 'Test semantic similarity search query', is_completed: false },
    ],
    tags: ['pgvector', 'RAG', 'AI'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    user_id: 'default-user',
    category_id: 'cat-spanish', // Linked to Spanish!
    study_topic_id: null,
    title: 'Master Spanish Past Tense Irregular Verbs',
    description: 'Practice preterite vs imperfect conjugations for ser, estar, ir, and hacer.',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    estimated_minutes: 45,
    completed_at: null,
    checklists: [
      { id: 'chk-4', task_id: 'task-2', title: 'Complete Anki flashcard deck (50 cards)', is_completed: false },
      { id: 'chk-5', task_id: 'task-2', title: 'Write 5 sample sentences using preterite', is_completed: false },
    ],
    tags: ['Spanish', 'Grammar'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    user_id: 'default-user',
    category_id: 'cat-bcs', // Linked to BCS!
    study_topic_id: null,
    title: 'Review BCS Bangladesh Affairs Key Historical Events',
    description: 'Study 1952 Language Movement, 1969 Mass Uprising, and 1971 Liberation War timeline.',
    status: 'todo',
    priority: 'urgent',
    due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    estimated_minutes: 90,
    completed_at: null,
    checklists: [
      { id: 'chk-6', task_id: 'task-3', title: 'Summarize 1952 to 1971 milestones', is_completed: false },
      { id: 'chk-7', task_id: 'task-3', title: 'Solve 20 previous BCS preliminary questions', is_completed: false },
    ],
    tags: ['BCS', 'History'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-4',
    user_id: 'default-user',
    category_id: 'cat-software', // Linked to Software Engineering!
    study_topic_id: null,
    title: 'System Design: Distributed Caching & Redis',
    description: 'Study cache invalidation patterns (Write-through, Write-behind, Cache-aside).',
    status: 'review',
    priority: 'high',
    due_date: new Date(Date.now() - 86400000).toISOString(),
    estimated_minutes: 60,
    completed_at: null,
    checklists: [
      { id: 'chk-8', task_id: 'task-4', title: 'Diagram cache-aside workflow', is_completed: true },
      { id: 'chk-9', task_id: 'task-4', title: 'Compare Redis LRU vs LFU eviction', is_completed: true },
    ],
    tags: ['System Design', 'Redis'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-5',
    user_id: 'default-user',
    category_id: 'cat-ai-agents', // Linked to Autonomous Agents!
    study_topic_id: null,
    title: 'Build Multi-Agent Tool Router with Vercel AI SDK',
    description: 'Configure agentic function calling for weather, search, and document retrieval tools.',
    status: 'done',
    priority: 'medium',
    due_date: new Date().toISOString(),
    estimated_minutes: 60,
    completed_at: new Date().toISOString(),
    checklists: [
      { id: 'chk-10', task_id: 'task-5', title: 'Define tool schemas with Zod', is_completed: true },
      { id: 'chk-11', task_id: 'task-5', title: 'Test multi-turn tool calling loop', is_completed: true },
    ],
    tags: ['Agents', 'Vercel AI SDK'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const LOCAL_TASKS_KEY = 'rizon_tasks_v2';

export function getLocalTasks(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  const stored = localStorage.getItem(LOCAL_TASKS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveLocalTasks(tasks: Task[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
  }
}

/**
 * Fetch all tasks (from Supabase or Local Fallback)
 */
export async function fetchTasks(filter?: {
  status?: TaskStatus;
  categoryId?: string;
  priority?: TaskPriority;
}): Promise<Task[]> {
  let tasks: Task[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

      if (filter?.status) query = query.eq('status', filter.status);
      if (filter?.categoryId) query = query.eq('category_id', filter.categoryId);
      if (filter?.priority) query = query.eq('priority', filter.priority);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        tasks = data as Task[];
      } else {
        tasks = getLocalTasks();
      }
    } catch (e) {
      console.warn('Supabase task fetch failed, using local store:', e);
      tasks = getLocalTasks();
    }
  } else {
    tasks = getLocalTasks();
  }

  if (filter?.status) {
    tasks = tasks.filter((t) => t.status === filter.status);
  }
  if (filter?.categoryId) {
    tasks = tasks.filter((t) => t.category_id === filter.categoryId);
  }
  if (filter?.priority) {
    tasks = tasks.filter((t) => t.priority === filter.priority);
  }
  return tasks;
}

/**
 * Create a new task
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
}): Promise<Task> {
  const taskId = 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const formattedChecklists: TaskChecklist[] = (input.checklists || []).map((item, idx) => ({
    id: `chk-${Date.now()}-${idx}`,
    task_id: taskId,
    title: item.title.trim(),
    is_completed: item.is_completed || false,
  }));

  const formattedDueDate = input.due_date && input.due_date.trim() ? input.due_date : null;

  const newTask: Task = {
    id: taskId,
    user_id: '00000000-0000-0000-0000-000000000000',
    category_id: input.category_id || null,
    study_topic_id: null,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    status: input.status || 'todo',
    priority: input.priority || 'medium',
    due_date: formattedDueDate,
    estimated_minutes: input.estimated_minutes || 30,
    completed_at: input.status === 'done' ? now : null,
    checklists: formattedChecklists,
    tags: input.tags || [],
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id || '00000000-0000-0000-0000-000000000000';

      const payload: Record<string, any> = {
        user_id: currentUserId,
        category_id: newTask.category_id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        due_date: newTask.due_date,
        estimated_minutes: newTask.estimated_minutes,
        completed_at: newTask.completed_at,
      };

      const { data, error } = await supabase.from('tasks').insert([payload]).select().single();
      if (error) {
        console.warn('Supabase task insert warning:', error.message);
      } else if (data) {
        newTask.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase task insert failed, using local store:', e);
    }
  }

  const current = getLocalTasks();
  const updated = [newTask, ...current];
  saveLocalTasks(updated);
  return newTask;
}

/**
 * Update task status (Optimized for Drag and Drop!)
 */
export async function updateTaskStatus(id: string, newStatus: TaskStatus): Promise<Task> {
  const now = new Date().toISOString();
  const completedAt = newStatus === 'done' ? now : null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase
        .from('tasks')
        .update({ status: newStatus, completed_at: completedAt, updated_at: now })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase status update failed:', e);
    }
  }

  const current = getLocalTasks();
  const index = current.findIndex((t) => t.id === id);
  if (index !== -1) {
    current[index] = {
      ...current[index],
      status: newStatus,
      completed_at: completedAt,
      updated_at: now,
    };
    saveLocalTasks(current);
    return current[index];
  }
  throw new Error('Task not found');
}

/**
 * Update full task details
 */
export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const now = new Date().toISOString();
  const formattedUpdates: Partial<Task> = {
    ...updates,
    updated_at: now,
  };

  if (updates.status === 'done') {
    formattedUpdates.completed_at = now;
  } else if (updates.status) {
    formattedUpdates.completed_at = null;
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('tasks').update(formattedUpdates).eq('id', id);
    } catch (e) {
      console.warn('Supabase update task failed:', e);
    }
  }

  const current = getLocalTasks();
  const index = current.findIndex((t) => t.id === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...formattedUpdates };
    saveLocalTasks(current);
    return current[index];
  }
  throw new Error('Task not found');
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('tasks').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete task failed:', e);
    }
  }

  const current = getLocalTasks();
  const remaining = current.filter((t) => t.id !== id);
  saveLocalTasks(remaining);
  return true;
}
