import { z } from 'zod';

export const getCountsResponseDtoSchema = z.object({
  teamsSize: z.number(),
  participantsSize: z.number(),
  clubsSize: z.number(),
  date: z.string(),
});
export type GetCountsResponseDto = z.infer<typeof getCountsResponseDtoSchema>;
