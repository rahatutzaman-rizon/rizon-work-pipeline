import { Category, CategoryNode } from '@/types';
import { createClient, isSupabaseConfigured } from './client';
import { slugify } from '../utils';

// Initial seed categories for Bangladesh BCS & Job Prep Database setup
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'bcs-bangla',
    user_id: 'default-user',
    parent_id: null,
    name: '১. বাংলা ভাষা ও সাহিত্য (Bangla)',
    slug: 'bangla-language-literature',
    description: 'BCS Preliminary 30 Marks: ভাষা (১৫) - প্রয়োগ-অপপ্রয়োগ, বানান, সমাস, কারক; সাহিত্য (১৫) - প্রাচীন ও মধ্যযুগ (০৫), আধুনিক যুগ (১০)',
    icon: 'BookOpen',
    color: '#10b981', // Emerald
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bcs-english',
    user_id: 'default-user',
    parent_id: null,
    name: '২. English Language & Literature',
    slug: 'english-language-literature',
    description: 'BCS Preliminary 30 Marks: Language (15) - Parts of Speech, Idioms, Clauses, Transformations; Literature (15) - Elizabethan to 21st Century',
    icon: 'Languages',
    color: '#0d9488', // Teal
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bcs-bd-affairs',
    user_id: 'default-user',
    parent_id: null,
    name: '৩. বাংলাদেশ বিষয়াবলী (BD Affairs)',
    slug: 'bangladesh-affairs',
    description: 'BCS Preliminary 30 Marks: ইতিহাস, মুক্তিযুদ্ধ, সংবিধান, কৃষি, জনসংখ্যা, অর্থনীতি, শিল্প ও সরকার ব্যবস্থা',
    icon: 'Landmark',
    color: '#84cc16', // Lime Green
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bcs-int-affairs',
    user_id: 'default-user',
    parent_id: null,
    name: '৪. আন্তর্জাতিক বিষয়াবলী (Int Affairs)',
    slug: 'international-affairs',
    description: 'BCS Preliminary 20 Marks: বৈশ্বিক ইতিহাস, আন্তর্জাতিক নিরাপত্তা, জাতিসংঘ, বিশ্ব সংস্থা ও জলবায়ু চুক্তি',
    icon: 'Globe',
    color: '#059669', // Dark Emerald
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bcs-geography',
    user_id: 'default-user',
    parent_id: null,
    name: '৫. ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা',
    slug: 'geography-environment-disaster',
    description: 'BCS Preliminary 10 Marks: ভৌগোলিক অবস্থান, ভূ-প্রকৃতি, পরিবেশ পরিবর্তন, ঘূর্ণিঝড় ও দুর্যোগ ব্যবস্থাপনা',
    icon: 'Compass',
    color: '#047857', // Forest Emerald
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bcs-science',
    user_id: 'default-user',
    parent_id: null,
    name: '৬. সাধারণ বিজ্ঞান (General Science)',
    slug: 'general-science',
    description: 'BCS Preliminary 15 Marks: ভৌত বিজ্ঞান (০৫), জীব বিজ্ঞান (০৫), আধুনিক বিজ্ঞান (০৫)',
    icon: 'Atom',
    color: '#16a34a', // Green
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bcs-computer',
    user_id: 'default-user',
    parent_id: null,
    name: '৭. কম্পিউটার ও তথ্যপ্রযুক্ত (Computer & IT)',
    slug: 'computer-it',
    description: 'BCS Preliminary 15 Marks: কম্পিউটার (১০) - সিপিইউ, মেমোরি, ওএস, ডাটাবেজ; তথ্যপ্রযুক্তি (০৫) - ই-কমার্স, নেটওয়ার্ক, ক্লাউড',
    icon: 'Cpu',
    color: '#14b8a6', // Light Teal
    sort_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bcs-math',
    user_id: 'default-user',
    parent_id: null,
    name: '৮. গাণিতিক যুক্তি (Mathematical Reasoning)',
    slug: 'mathematical-reasoning',
    description: 'BCS Preliminary 15 Marks: বাস্তব সংখ্যা, বীজগণিত, সূচক-লগারিদম, জ্যামিতি, সেট, বিন্যাস-সমাবেশ',
    icon: 'Calculator',
    color: '#0f766e', // Teal
    sort_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bcs-mental-ability',
    user_id: 'default-user',
    parent_id: null,
    name: '৯. মানসিক দক্ষতা (Mental Ability)',
    slug: 'mental-ability',
    description: 'BCS Preliminary 15 Marks: ভাষাগত যৌক্তিক বিচার, বানান ও ভাষা, যান্ত্রিক দক্ষতা, স্থানাঙ্ক সম্পর্ক, সংখ্যাগত ক্ষমতা',
    icon: 'Brain',
    color: '#0284c7', // Sky Blue
    sort_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bcs-ethics',
    user_id: 'default-user',
    parent_id: null,
    name: '১০. নৈতিকতা, মূল্যবোধ ও সুশাসন',
    slug: 'ethics-values-good-governance',
    description: 'BCS Preliminary 10 Marks: সুশাসনের সংজ্ঞা, মূল্যবোধের উপাদান, নাগরিক কর্তব্য ও জাতীয় উন্নয়ন',
    icon: 'ShieldCheck',
    color: '#15803d', // Green
    sort_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bank-job-prep',
    user_id: 'default-user',
    parent_id: null,
    name: 'ব্যাংক জব প্রস্তুতি (Bank Job Portal)',
    slug: 'bank-job-prep',
    description: 'Combined 9 Banks Senior Officer, Officer General, Cash: Focus Writing, Banking Math, Translation & Viva',
    icon: 'Building2',
    color: '#065f46', // Deep Emerald
    sort_order: 11,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'it-software-automation',
    user_id: 'default-user',
    parent_id: null,
    name: 'IT, Software & AI Automation (Rizon CV)',
    slug: 'it-software-automation',
    description: 'Rahatutzaman Rizon Full Stack CV: n8n Workflow Automation, Next.js, Node.js, AI/RAG, Multi-tenant ERP, Docker CI/CD',
    icon: 'Terminal',
    color: '#0369a1', // Deep Sky
    sort_order: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'english-spanish-learning',
    user_id: 'default-user',
    parent_id: null,
    name: 'Languages: English & Spanish Speaking',
    slug: 'english-spanish-learning',
    description: 'Spoken English & Spanish conversational cards, vocabulary, speech audio pronunciation & grammar',
    icon: 'Languages',
    color: '#0d9488', // Teal
    sort_order: 13,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // SUB-TOPICS FROM OFFICIAL BPSC SYLLABUS PDF
  // Bangla Sub-topics
  {
    id: 'bangla-bhasha',
    user_id: 'default-user',
    parent_id: 'bcs-bangla',
    name: 'বাংলা ভাষা (১৫ নম্বর)',
    slug: 'bangla-bhasha',
    description: 'প্রয়োগ-অপপ্রয়োগ, বানান ও বাক্য শুদ্ধি, পরিভাষা, সমার্থক ও বিপরীতার্থক শব্দ, ধ্বনি, বর্ণ, শব্দ, পদ, বাক্য, প্রত্যয়, সন্ধি ও সমাস',
    icon: 'BookOpen',
    color: '#10b981',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bangla-sahitya',
    user_id: 'default-user',
    parent_id: 'bcs-bangla',
    name: 'বাংলা সাহিত্য (১৫ নম্বর)',
    slug: 'bangla-sahitya',
    description: 'প্রাচীন ও মধ্যযুগ (০৫) - চর্যাপদ, মঙ্গলকাব্য; আধুনিক যুগ (১০) - ১৮০০ থেকে বর্তমান পর্যন্ত সাহিত্যিক ও কাব্যগ্রন্থ',
    icon: 'BookOpen',
    color: '#059669',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Computer & IT Sub-topics
  {
    id: 'computer-hardware',
    user_id: 'default-user',
    parent_id: 'bcs-computer',
    name: 'কম্পিউটার অংশ (১০ নম্বর)',
    slug: 'computer-hardware-os',
    description: 'পেরিফেরালস (Keyboard, Mouse, OCR), আর্কিটেকচার (CPU, Hard Disk, ALU), Operating Systems, Database System & VIRUS/Firewall',
    icon: 'Cpu',
    color: '#14b8a6',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'it-networks',
    user_id: 'default-user',
    parent_id: 'bcs-computer',
    name: 'তথ্যপ্রযুক্তি অংশ (০৫ নম্বর)',
    slug: 'it-networks-cloud',
    description: 'E-Commerce, Cellular Data (2G, 3G, 4G, Wimax), Computer Networks (LAN, MAN, WiFi), SmartPhone, Cloud Computing, Cyber Crime',
    icon: 'Globe',
    color: '#0d9488',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Math Sub-topics
  {
    id: 'math-algebra',
    user_id: 'default-user',
    parent_id: 'bcs-math',
    name: 'পাটিগণিত ও বীজগণিত (০৮ নম্বর)',
    slug: 'patigonit-bijgonit',
    description: 'বাস্তব সংখ্যা, ল.সা.গু, গ.সা.গু, শতকরা, সরল ও যৌগিক মুনাফা, অনুপাত-সমানুপাত, লাভ ও ক্ষতি, বীজগণিতীয় সূত্রাবলী ও সমীকরণ',
    icon: 'Calculator',
    color: '#0f766e',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'math-geometry-perm',
    user_id: 'default-user',
    parent_id: 'bcs-math',
    name: 'জ্যামিতি, সেট ও বিন্যাস (০৭ নম্বর)',
    slug: 'geometry-set-permutation',
    description: 'সূচক ও লগারিদম, সমান্তর ও গুণোত্তর ধারা, রেখা, কোণ, পিথাগোরাস উপপাদ্য, সেট, বিন্যাস ও সমাবেশ, পরিসংখ্যন ও সম্ভাব্যতা',
    icon: 'Calculator',
    color: '#047857',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const LOCAL_CATEGORIES_KEY = 'rizon_categories_bcs_v6';

export function getLocalCategories(): Category[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  const stored = localStorage.getItem(LOCAL_CATEGORIES_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    const parsed = JSON.parse(stored);
    if (!parsed || parsed.length < 10) {
      localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return parsed;
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
 * Fetch all categories 100% dynamically from Supabase database
 */
export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Supabase fetchCategories error:', error.message);
      } else if (data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, using fallback:', e);
    }
  }
  return getLocalCategories();
}

/**
 * Create a new category directly in Supabase
 */
export async function createCategory(input: {
  name: string;
  description?: string;
  parent_id?: string | null;
  icon?: string;
  color?: string;
}): Promise<Category> {
  const newCat: Category = {
    id: crypto.randomUUID(),
    user_id: 'default-user',
    parent_id: input.parent_id || null,
    name: input.name.trim(),
    slug: slugify(input.name),
    description: input.description?.trim() || null,
    icon: input.icon || 'Folder',
    color: input.color || '#4f46e5',
    sort_order: 99,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const payload = {
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        parent_id: newCat.parent_id,
        icon: newCat.icon,
        color: newCat.color,
      };

      const { data, error } = await supabase.from('categories').insert([payload]).select().single();
      if (!error && data) {
        return data as Category;
      } else if (error) {
        console.warn('Supabase createCategory error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase insert failed:', e);
    }
  }

  const current = getLocalCategories();
  const updated = [...current, newCat];
  saveLocalCategories(updated);
  return newCat;
}

/**
 * Update category
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
 * Delete category
 */
export async function deleteCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('categories').delete().eq('id', id);
      return true;
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const current = getLocalCategories();
  const remaining = current.filter((c) => c.id !== id && c.parent_id !== id);
  saveLocalCategories(remaining);
  return true;
}

/**
 * Helper to seed default study domains into Supabase directly from UI
 */
export async function seedSupabaseCategories(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createClient();
    const payload = INITIAL_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      parent_id: c.parent_id,
      icon: c.icon,
      color: c.color,
      sort_order: c.sort_order,
    }));
    const { error } = await supabase.from('categories').upsert(payload);
    return !error;
  } catch {
    return false;
  }
}
