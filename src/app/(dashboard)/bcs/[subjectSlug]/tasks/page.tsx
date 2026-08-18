'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckSquare } from 'lucide-react';
import { TaskItem, SubjectItem, fetchSubjectBySlug, fetchTasksBySubject } from '@/lib/supabase/modules-db';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';

export default function BcsSubjectTasksPage({ params }: { params: Promise<{ subjectSlug: string }> }) {
  const resolvedParams = use(params);
  const subjectSlug = resolvedParams.subjectSlug;

  const [subject, setSubject] = useState<SubjectItem | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    loadTasks();
  }, [subjectSlug]);

  const loadTasks = async () => {
    setLoading(true);
    const sub = await fetchSubjectBySlug('bcs', subjectSlug);
    setSubject(sub);
    if (sub) {
      const list = await fetchTasksBySubject('bcs', sub.id);
      setTasks(list);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Tasks...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <Link href={`/bcs/${subjectSlug}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700">
        <ArrowLeft className="w-4 h-4 text-emerald-600" />
        <span>Back to {subject?.name_bn || subjectSlug} Workspace</span>
      </Link>

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-black text-slate-900">Tasks List: {subject?.name_bn || subjectSlug}</h1>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                  Priority: {task.priority}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Status: {task.status}</span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900">{task.title}</h4>
              {task.description && <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 font-bold">
          No tasks added yet for this subject in Supabase.
        </div>
      )}

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} onRefresh={loadTasks} />
    </div>
  );
}
