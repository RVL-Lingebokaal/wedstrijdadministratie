import { z } from 'zod';

export const addWedstrijdSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  date: z.string(),
  description: z.string().optional(),
  amountOfBlocks: z
    .number()
    .min(1, 'Aantal blokken is verplicht')
    .max(5, 'Maximaal 5 blokken'),
});
export type WedstrijdAddForm = z.infer<typeof addWedstrijdSchema>;
