import { ExamSchedule } from '@/types';

export const INITIAL_SCHEDULES: ExamSchedule[] = [
  {
    id: 'sch-1',
    title: '৪৭তম বিসিএস প্রিলিমিনারি পরীক্ষা (47th BCS Preliminary Exam)',
    exam_type: 'BCS',
    date: '2026-11-20',
    time: '10:00 AM - 12:00 PM',
    venue_or_notice: 'Dhaka, Rajshahi, Chittagong, Khulna, Barisal, Sylhet, Rangpur, Mymensingh Centers',
    marks_total: 200,
    official_link: 'http://bpsc.gov.bd',
    status: 'upcoming',
    topics_covered: ['Bangla', 'English', 'BD Affairs', 'Int Affairs', 'Math', 'IT', 'Science'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-2',
    title: 'কম্বাইন্ড ৯ ব্যাংক সিনিয়র অফিসার লিখিত পরীক্ষা (Combined 9 Banks Senior Officer)',
    exam_type: 'Bank',
    date: '2026-09-18',
    time: '02:30 PM - 04:30 PM',
    venue_or_notice: 'Bangladesh Bank Recruitment Board Centers, Dhaka',
    marks_total: 200,
    official_link: 'https://erecruiter.bb.org.bd',
    status: 'upcoming',
    topics_covered: ['Focus Writing', 'Bank Math', 'Banking Knowledge', 'Translation'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-3',
    title: 'বাংলাদেশ ব্যাংক সহকারী পরিচালক (AD) প্রিলিমিনারি পরীক্ষা',
    exam_type: 'Bank',
    date: '2026-10-05',
    time: '10:00 AM - 11:00 AM',
    venue_or_notice: 'Dhaka City Centers',
    marks_total: 100,
    official_link: 'https://erecruiter.bb.org.bd',
    status: 'upcoming',
    topics_covered: ['English', 'Analytical Reasoning', 'General Knowledge'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-4',
    title: 'বিসিসি ও আইসিটি অধিদপ্তর সহকারী প্রোগ্রামার ও সিস্টেম অ্যানালিস্ট পরীক্ষা',
    exam_type: 'IT Job',
    date: '2026-10-25',
    time: '03:00 PM - 04:30 PM',
    venue_or_notice: 'BUET Testing Center, Dhaka',
    marks_total: 100,
    official_link: 'http://bcc.gov.bd',
    status: 'upcoming',
    topics_covered: ['System Design', 'DBMS', 'OOP', 'Data Structure & Algorithms'],
    created_at: new Date().toISOString(),
  },
];

const LOCAL_SCHED_KEY = 'rizon_schedules_bcs_v1';

export function getLocalSchedules(): ExamSchedule[] {
  if (typeof window === 'undefined') return INITIAL_SCHEDULES;
  const stored = localStorage.getItem(LOCAL_SCHED_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_SCHED_KEY, JSON.stringify(INITIAL_SCHEDULES));
    return INITIAL_SCHEDULES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SCHEDULES;
  }
}

export function saveLocalSchedules(schedules: ExamSchedule[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_SCHED_KEY, JSON.stringify(schedules));
  }
}

export async function fetchSchedules(): Promise<ExamSchedule[]> {
  return getLocalSchedules();
}

export async function createSchedule(input: {
  title: string;
  exam_type: 'BCS' | 'Bank' | 'IT Job' | 'Primary/NTRCA' | 'Other Govt';
  date: string;
  time?: string;
  venue_or_notice?: string;
  marks_total?: number;
  official_link?: string;
}): Promise<ExamSchedule> {
  const newSched: ExamSchedule = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    exam_type: input.exam_type,
    date: input.date,
    time: input.time,
    venue_or_notice: input.venue_or_notice,
    marks_total: input.marks_total || 200,
    official_link: input.official_link,
    status: 'upcoming',
    created_at: new Date().toISOString(),
  };

  const current = getLocalSchedules();
  const updated = [newSched, ...current];
  saveLocalSchedules(updated);
  return newSched;
}
