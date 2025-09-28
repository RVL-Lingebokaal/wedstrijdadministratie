import { z } from 'zod';
import { addWedstrijdSchema } from '@schemas';

export const wedstrijdSchema = addWedstrijdSchema.extend({
  id: z.string(),
});
export type Wedstrijd = z.infer<typeof wedstrijdSchema>;

export function isWedstrijd(obj: unknown): obj is Wedstrijd {
  return wedstrijdSchema.safeParse(obj).success;
}

export const createWedstrijdDtoResponseSchema = z.object({
  success: z.boolean(),
  wedstrijdId: z.string(),
});
