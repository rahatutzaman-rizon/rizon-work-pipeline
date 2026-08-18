export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  study_goal_hours: number;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
  topic_count?: number;
  task_count?: number;
  note_count?: number;
  document_count?: number;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskChecklist {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  created_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  user_id: string;
  category_id: string | null;
  study_topic_id: string | null;
  project_id?: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  estimated_minutes: number;
  completed_at: string | null;
  checklists?: TaskChecklist[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface NoteItem {
  id: string;
  user_id?: string;
  category_id: string;
  title: string;
  bangla_title?: string;
  content: string;
  tags: string[];
  image_urls?: string[];
  pdf_url?: string;
  is_pinned?: boolean;
  ai_generated?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamSchedule {
  id: string;
  title: string;
  exam_type: 'BCS' | 'Bank' | 'IT Job' | 'Primary/NTRCA' | 'Other Govt';
  date: string;
  time?: string;
  venue_or_notice?: string;
  marks_total?: number;
  official_link?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  topics_covered?: string[];
  created_at: string;
}

export interface StudyTopic {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string | null;
  stage: 'not_started' | 'learning' | 'practicing' | 'mastered';
  priority: TaskPriority;
  target_date: string | null;
  pyq_count?: number;
  key_formulas?: string[];
  created_at: string;
  updated_at: string;
}

export interface QuickStats {
  total_categories: number;
  total_topics: number;
  completed_tasks: number;
  total_tasks: number;
  total_notes: number;
  total_documents: number;
  study_progress_percent: number;
}

