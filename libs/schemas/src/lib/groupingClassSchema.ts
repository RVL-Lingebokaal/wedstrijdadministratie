import { z } from 'zod';

export const groupingClassSchema = z.object({
  name: z.string(),
});
export type GroupingForm = z.infer<typeof groupingClassSchema>;
