import { create } from 'zustand';
import { Category, CategoryNode } from '@/types';
import { buildCategoryTree, fetchCategories } from '@/lib/supabase/db';

interface CategoryState {
  categories: Category[];
  tree: CategoryNode[];
  selectedCategory: Category | null;
  expandedIds: Set<string>;
  searchQuery: string;
  isLoading: boolean;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit';
  modalParentId: string | null;
  categoryToEdit: Category | null;

  // Actions
  loadCategories: () => Promise<void>;
  setSelectedCategory: (category: Category | null) => void;
  toggleExpand: (id: string) => void;
  setSearchQuery: (query: string) => void;
  openCreateModal: (parentId?: string | null) => void;
  openEditModal: (category: Category) => void;
  closeModal: () => void;
  setCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  tree: [],
  selectedCategory: null,
  expandedIds: new Set(['cat-ai']), // Expand 'cat-ai' by default to highlight nested RAG & Autonomous Agents!
  searchQuery: '',
  isLoading: false,
  isModalOpen: false,
  modalMode: 'create',
  modalParentId: null,
  categoryToEdit: null,

  loadCategories: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchCategories();
      const tree = buildCategoryTree(data);
      set({ categories: data, tree, isLoading: false });
    } catch (err) {
      console.error('Failed to load categories', err);
      set({ isLoading: false });
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  toggleExpand: (id) => {
    set((state) => {
      const next = new Set(state.expandedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { expandedIds: next };
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  openCreateModal: (parentId = null) =>
    set({
      isModalOpen: true,
      modalMode: 'create',
      modalParentId: parentId,
      categoryToEdit: null,
    }),

  openEditModal: (category) =>
    set({
      isModalOpen: true,
      modalMode: 'edit',
      categoryToEdit: category,
      modalParentId: category.parent_id,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      categoryToEdit: null,
      modalParentId: null,
    }),

  setCategories: (categories) => {
    const tree = buildCategoryTree(categories);
    set({ categories, tree });
  },
}));
