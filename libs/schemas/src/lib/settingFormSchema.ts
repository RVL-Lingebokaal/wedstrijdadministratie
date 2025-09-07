import { z } from 'zod';

export const settingFormSchema = z.object({
  date: z.string(),
  missingNumbers: z
    .array(
      z.object({
        value: z.number(),
      })
    )
    .min(0),
  currentNumber: z.number().optional(),
});
export type SettingForm = z.infer<typeof settingFormSchema>;
