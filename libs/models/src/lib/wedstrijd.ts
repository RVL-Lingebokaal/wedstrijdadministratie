import { z } from 'zod';
import { ageItem, boatItemForm, classItem } from './settings';

export const basicWedstrijdInfoSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  description: z.string().optional(),
  amountOfBlocks: z
    .number()
    .min(1, 'Aantal blokken is verplicht')
    .max(5, 'Maximaal 5 blokken'),
});
export type BasicWedstrijdInfo = z.infer<typeof basicWedstrijdInfoSchema>;
export const createWedstrijdFormSchema = basicWedstrijdInfoSchema.extend({
  isJeugd: z.boolean().optional(),
  date: z.string(),
});
export type CreateWedstrijdForm = z.infer<typeof createWedstrijdFormSchema>;

export const wedstrijdSchema = basicWedstrijdInfoSchema.extend({
  id: z.string(),
  settings: z.object({
    general: z.object({
      missingNumbers: z.number().array().optional(),
      isJeugd: z.boolean().optional(),
      date: z.string(),
      startNumbersAreFixed: z.boolean().optional(),
    }),
    boats: z.array(boatItemForm).optional(),
    ages: z.array(ageItem).optional(),
    classes: z.array(classItem).optional(),
  }),
});
export type Wedstrijd = z.infer<typeof wedstrijdSchema>;

export function isWedstrijd(obj: unknown): obj is Wedstrijd {
  return wedstrijdSchema.safeParse(obj).success;
}

export const createWedstrijdDtoResponseSchema = z.object({
  success: z.boolean(),
  wedstrijdId: z.string(),
});
