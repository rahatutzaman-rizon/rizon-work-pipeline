'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Plus,
  LayoutGrid,
  List,
  Search,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useTaskStore } from '@/lib/store/task-store';
import { useCategoryStore } from '@/lib/store/category-store';
import { seedSupabaseTasks } from '@/lib/supabase/tasks-db';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { TaskListView } from '@/components/tasks/TaskListView';
import { TaskModal } from '@/components/tasks/TaskModal';

export default function TasksPage() {
  const {
    tasks,
    viewMode,
    activeTab,
    selectedCategoryFilter,
    searchQuery,
    setViewMode,
    setActiveTab,
    setSelectedCategoryFilter,
    setSearchQuery,
    openCreateTaskModal,
    loadTasks,
  } = useTaskStore();

  const { categories, loadCategories } = useCategoryStore();
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [loadTasks, loadCategories]);

  const handleSeedTasks = async () => {
    setIsSeeding(true);
    await seedSupabaseTasks();
    await loadTasks();
    setIsSeeding(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (selectedCategoryFilter && task.category_id !== selectedCategoryFilter) {
      return false;
    }

    if (activeTab === 'today') {
      if (!task.due_date) return false;
      const todayStr = new Date().toISOString().split('T')[0];
      const taskDateStr = task.due_date.split('T')[0];
      return taskDateStr <= todayStr && task.status !== 'done';
    }

    if (activeTab === 'completed') {
      return task.status === 'done';
    }

    return true;
  });

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'todo').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Task Engine & dnd-kit Kanban Board Active</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Management</h1>
          <p className="text-xs text-slate-500">
            Organize tasks by status, priority, and link directly to your Study Domains.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedTasks}
            disabled={isSeeding}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
            <span>Sync Default Tasks</span>
          </button>
          <button
            onClick={openCreateTaskModal}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Tasks</span>
            <CheckSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalTasks}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-sky-600">{inProgressCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Pending To-Do</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{pendingCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{completedCount}</p>
        </div>
      </div>

      {/* Controls Bar: Search, Category Filter, Tabs & View Switcher */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Left: Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tasks ({totalTasks})
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'today'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today / Due Soon
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Middle: Category Domain Filter & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Category Dropdown */}
          <select
            value={selectedCategoryFilter || ''}
            onChange={(e) => setSelectedCategoryFilter(e.target.value || null)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0 font-medium"
          >
            <option value="">All Study Domains</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
        </div>

        {/* Right: View Switcher (Kanban vs List) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 text-xs shrink-0">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-bold ${
              viewMode === 'kanban' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Kanban Board View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-bold ${
              viewMode === 'list' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="List Table View"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'kanban' ? (
        <KanbanBoard tasks={filteredTasks} />
      ) : (
        <TaskListView tasks={filteredTasks} />
      )}

      {/* Task Creation & Edit Modal */}
      <TaskModal />
    </div>
  );
}
