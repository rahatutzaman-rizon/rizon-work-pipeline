import { Category, CategoryNode, Profile } from '@/types';
import { createClient, isSupabaseConfigured } from './client';
import { slugify } from '../utils';

// Initial default seed categories required by the sidebar specification
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-bcs',
    user_id: 'default-user',
    parent_id: null,
    name: 'BCS',
    slug: 'bcs',
    description: 'Bangladesh Civil Service preparation & syllabus topics',
    icon: 'GraduationCap',
    color: '#8b5cf6', // Violet
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-spanish',
    user_id: 'default-user',
    parent_id: null,
    name: 'Spanish',
    slug: 'spanish',
    description: 'Spanish language acquisition, grammar & vocabulary',
    icon: 'Languages',
    color: '#f59e0b', // Amber
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-english',
    user_id: 'default-user',
    parent_id: null,
    name: 'English',
    slug: 'english',
    description: 'English literature, writing & advanced communication',
    icon: 'BookOpen',
    color: '#06b6d4', // Cyan
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-ai',
    user_id: 'default-user',
    parent_id: null,
    name: 'AI',
    slug: 'ai',
    description: 'Artificial Intelligence, Machine Learning, RAG & LLM Agents',
    icon: 'Bot',
    color: '#6366f1', // Indigo
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Nested sub-categories under AI to prove unlimited parent_id nesting!
  {
    id: 'cat-ai-rag',
    user_id: 'default-user',
    parent_id: 'cat-ai',
    name: 'RAG Architecture',
    slug: 'rag-architecture',
    description: 'Retrieval Augmented Generation & Vector Databases',
    icon: 'Database',
    color: '#3b82f6', // Blue
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-ai-agents',
    user_id: 'default-user',
    parent_id: 'cat-ai',
    name: 'Autonomous Agents',
    slug: 'autonomous-agents',
    description: 'Agentic workflows, tool use & multi-agent systems',
    icon: 'Cpu',
    color: '#ec4899', // Pink
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-software',
    user_id: 'default-user',
    parent_id: null,
    name: 'Software Engineering',
    slug: 'software-engineering',
    description: 'System design, web frameworks, databases & algorithms',
    icon: 'Code2',
    color: '#10b981', // Emerald
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-other',
    user_id: 'default-user',
    parent_id: null,
    name: 'Other',
    slug: 'other',
    description: 'General knowledge, books & personal development',
    icon: 'Folder',
    color: '#64748b', // Slate
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Local storage key for fallback persistence when Supabase credentials aren't set
const LOCAL_CATEGORIES_KEY = 'rizon_categories_v1';

export function getLocalCategories(): Category[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  const stored = localStorage.getItem(LOCAL_CATEGORIES_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveLocalCategories(categories: Category[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(categories));
  }
}

/**
 * Build recursive CategoryNode tree from flat Category list
 */
export function buildCategoryTree(categories: Category[], parentId: string | null = null): CategoryNode[] {
  return categories
    .filter((cat) => cat.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
    .map((cat) => ({
      ...cat,
      children: buildCategoryTree(categories, cat.id),
    }));
}

/**
 * Fetch all categories for current user (from Supabase or Local Fallback)
 */
export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store:', e);
    }
  }
  return getLocalCategories();
}

/**
 * Create a new category (supports parent_id for unlimited nesting)
 */
export async function createCategory(input: {
  name: string;
  description?: string;
  parent_id?: string | null;
  icon?: string;
  color?: string;
}): Promise<Category> {
  const newCat: Category = {
    id: 'cat-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    user_id: 'default-user',
    parent_id: input.parent_id || null,
    name: input.name.trim(),
    slug: slugify(input.name),
    description: input.description?.trim() || null,
    icon: input.icon || 'Folder',
    color: input.color || '#6366f1',
    sort_order: 99,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;

      const payload: Record<string, any> = {
        parent_id: newCat.parent_id,
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        icon: newCat.icon,
        color: newCat.color,
      };

      if (currentUserId) {
        payload.user_id = currentUserId;
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return data as Category;
      }
    } catch (e) {
      console.warn('Supabase insert failed, using local persistence:', e);
    }
  }

  const current = getLocalCategories();
  const updated = [...current, newCat];
  saveLocalCategories(updated);
  return newCat;
}

/**
 * Update an existing category
 */
export async function updateCategory(
  id: string,
  input: {
    name?: string;
    description?: string;
    parent_id?: string | null;
    icon?: string;
    color?: string;
  }
): Promise<Category> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const updates: Partial<Category> = {
        updated_at: new Date().toISOString(),
      };
      if (input.name) {
        updates.name = input.name.trim();
        updates.slug = slugify(input.name);
      }
      if (input.description !== undefined) updates.description = input.description;
      if (input.parent_id !== undefined) updates.parent_id = input.parent_id;
      if (input.icon) updates.icon = input.icon;
      if (input.color) updates.color = input.color;

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Category;
      }
    } catch (e) {
      console.warn('Supabase update failed:', e);
    }
  }

  const current = getLocalCategories();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Category not found');

  const updatedCat: Category = {
    ...current[index],
    name: input.name ? input.name.trim() : current[index].name,
    slug: input.name ? slugify(input.name) : current[index].slug,
    description: input.description !== undefined ? input.description : current[index].description,
    parent_id: input.parent_id !== undefined ? input.parent_id : current[index].parent_id,
    icon: input.icon || current[index].icon,
    color: input.color || current[index].color,
    updated_at: new Date().toISOString(),
  };

  current[index] = updatedCat;
  saveLocalCategories(current);
  return updatedCat;
}

/**
 * Delete a category (recursively deleting sub-categories locally or via DB CASCADE)
 */
export async function deleteCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const current = getLocalCategories();
  // Find all child IDs recursively
  const getSubTreeIds = (catId: string): string[] => {
    const children = current.filter((c) => c.parent_id === catId);
    return [catId, ...children.flatMap((child) => getSubTreeIds(child.id))];
  };

  const toRemove = new Set(getSubTreeIds(id));
  const remaining = current.filter((c) => !toRemove.has(c.id));
  saveLocalCategories(remaining);
  return true;
}
