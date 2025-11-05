import { addTeamSchema } from './addTeamSchema';
import { z } from 'zod';

export const updateTeamSchema = addTeamSchema.extend({
  team: z.string(),
  unsubscribed: z.boolean().optional(),
});
