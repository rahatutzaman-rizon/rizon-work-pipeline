'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ExternalLink,
  GraduationCap,
  Building2,
  Cpu,
  Award,
  Bell,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { ExamSchedule } from '@/types';
import { fetchSchedules, createSchedule } from '@/lib/supabase/schedules-db';

export const ExamScheduleBoard: React.FC = () => {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<'BCS' | 'Bank' | 'IT Job' | 'Primary/NTRCA' | 'Other Govt'>('BCS');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('10:00 AM - 12:00 PM');
  const [formVenue, setFormVenue] = useState('Dhaka City Centers');
  const [formLink, setFormLink] = useState('');

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    const data = await fetchSchedules();
    setSchedules(data);
  };

  const handleAddSchedule = async () => {
    if (!formTitle.trim() || !formDate) return;

    const newSched = await createSchedule({
      title: formTitle,
      exam_type: formType,
      date: formDate,
      time: formTime,
      venue_or_notice: formVenue,
      official_link: formLink || undefined,
    });

    setSchedules([newSched, ...schedules]);
    setIsModalOpen(false);
    setFormTitle('');
    setFormDate('');
  };

  const calculateDaysLeft = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((target - now) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  };

  const getTypeBadge = (type: ExamSchedule['exam_type']) => {
    switch (type) {
      case 'BCS':
        return { label: 'BCS Exam', bg: 'bg-emerald-600', icon: GraduationCap };
      case 'Bank':
        return { label: 'Bank Job', bg: 'bg-teal-600', icon: Building2 };
      case 'IT Job':
        return { label: 'IT & Software', bg: 'bg-lime-600', icon: Cpu };
      default:
        return { label: 'Govt Job', bg: 'bg-emerald-700', icon: Award };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold">
              <Bell className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
              <span>Official Circulars & Exam Calendar</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Upcoming <span className="text-emerald-200">Exam Schedules</span> & Notices
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Track official 47th BCS Preliminary, Combined Bank Senior Officer, and Govt IT recruitment exam dates with real-time day countdowns.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Custom Exam Schedule</span>
          </button>
        </div>
      </div>

      {/* Featured Exam Countdowns Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Live Exam Countdowns</h3>
            <p className="text-xs text-slate-500">Days remaining until official Bangladesh recruitment exams</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {schedules.slice(0, 4).map((sched) => {
            const daysLeft = calculateDaysLeft(sched.date);
            const badge = getTypeBadge(sched.exam_type);
            const Icon = badge.icon;

            return (
              <div
                key={sched.id}
                className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold text-white uppercase flex items-center gap-1 ${badge.bg}`}>
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {daysLeft} Days Left
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 line-clamp-2 mt-2">{sched.title}</h4>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-slate-800">{new Date(sched.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                  </div>
                  {sched.time && <p className="text-[11px] text-slate-500">{sched.time}</p>}
                  {sched.venue_or_notice && (
                    <p className="text-[11px] text-slate-500 line-clamp-1 italic">{sched.venue_or_notice}</p>
                  )}
                </div>

                {sched.official_link && (
                  <a
                    href={sched.official_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Official Circular</span>
                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Schedules List Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">All Scheduled Exam Notices</h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {schedules.length} Active Records
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {schedules.map((sched) => {
            const badge = getTypeBadge(sched.exam_type);

            return (
              <div key={sched.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold text-white ${badge.bg}`}>
                      {sched.exam_type}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{sched.title}</span>
                  </div>
                  <p className="text-xs text-slate-500">{sched.venue_or_notice || 'Official Bangladesh Govt Recruitment Test'}</p>

                  {sched.topics_covered && sched.topics_covered.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {sched.topics_covered.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-slate-900">
                      {new Date(sched.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </p>
                    <p className="text-[10px] font-mono text-emerald-600 font-bold">
                      {calculateDaysLeft(sched.date)} Days Remaining
                    </p>
                  </div>

                  {sched.official_link && (
                    <a
                      href={sched.official_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-600 hover:text-emerald-700 transition-colors"
                      title="Open Circular Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-emerald-200 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Exam Schedule / Circular</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam / Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. 48th BCS Written Exam"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exam Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="BCS">BCS Exam</option>
                    <option value="Bank">Bank Job</option>
                    <option value="IT Job">IT & Software</option>
                    <option value="Primary/NTRCA">Teacher Exam</option>
                    <option value="Other Govt">Other Govt Job</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue / Notice Details</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka Centers (Dhaka College, Ideal College)"
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Circular URL</label>
                <input
                  type="url"
                  placeholder="http://bpsc.gov.bd"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSchedule}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all"
              >
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
