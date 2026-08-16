import { z } from 'zod';

export const taskChecklistSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Sub-task title is required'),
  is_completed: z.boolean().default(false),
});

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(120, 'Title must be under 120 characters'),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category_id: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  estimated_minutes: z.number().min(5).max(480).default(30),
  checklists: z.array(taskChecklistSchema).default([]),
  tags: z.array(z.string()).default([]),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
