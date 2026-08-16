import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Name must be under 50 characters'),
  description: z.string().max(200, 'Description must be under 200 characters').optional(),
  parent_id: z.string().nullable().optional(),
  icon: z.string().default('Folder'),
  color: z.string().default('#6366f1'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
