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

export interface StudyTopic {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string | null;
  stage: 'not_started' | 'learning' | 'practicing' | 'mastered';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  target_date: string | null;
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
