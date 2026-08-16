import { create } from 'zustand';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { fetchTasks, updateTaskStatus, deleteTask } from '@/lib/supabase/tasks-db';

interface TaskState {
  tasks: Task[];
  viewMode: 'kanban' | 'list';
  activeTab: 'all' | 'today' | 'completed';
  selectedCategoryFilter: string | null;
  searchQuery: string;
  isLoading: boolean;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit';
  taskToEdit: Task | null;

  // Actions
  loadTasks: () => Promise<void>;
  setViewMode: (mode: 'kanban' | 'list') => void;
  setActiveTab: (tab: 'all' | 'today' | 'completed') => void;
  setSelectedCategoryFilter: (catId: string | null) => void;
  setSearchQuery: (query: string) => void;
  openCreateTaskModal: () => void;
  openEditTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  viewMode: 'kanban',
  activeTab: 'all',
  selectedCategoryFilter: null,
  searchQuery: '',
  isLoading: false,
  isModalOpen: false,
  modalMode: 'create',
  taskToEdit: null,

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchTasks();
      set({ tasks: data, isLoading: false });
    } catch (err) {
      console.error('Failed to load tasks:', err);
      set({ isLoading: false });
    }
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedCategoryFilter: (catId) => set({ selectedCategoryFilter: catId }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  openCreateTaskModal: () =>
    set({
      isModalOpen: true,
      modalMode: 'create',
      taskToEdit: null,
    }),

  openEditTaskModal: (task) =>
    set({
      isModalOpen: true,
      modalMode: 'edit',
      taskToEdit: task,
    }),

  closeTaskModal: () =>
    set({
      isModalOpen: false,
      taskToEdit: null,
    }),

  moveTask: async (taskId, newStatus) => {
    // Optimistic UI update!
    const currentTasks = get().tasks;
    const updated = currentTasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: newStatus,
            completed_at: newStatus === 'done' ? new Date().toISOString() : null,
          }
        : t
    );
    set({ tasks: updated });

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (e) {
      console.error('Failed to update task status remotely:', e);
      set({ tasks: currentTasks }); // Rollback on error
    }
  },

  removeTask: async (taskId) => {
    const current = get().tasks;
    set({ tasks: current.filter((t) => t.id !== taskId) });
    try {
      await deleteTask(taskId);
    } catch (e) {
      console.error('Failed to delete task:', e);
      set({ tasks: current });
    }
  },
}));
