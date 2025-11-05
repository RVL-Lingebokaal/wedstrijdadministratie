import { boatTypes, genders } from '@models';
import { z } from 'zod';

const participantSchema = z.object({
  name: z.string(),
  club: z.string(),
  birthYear: z.string().min(4).max(4),
  id: z.string().optional(),
});

export const addTeamSchema = z.object({
  name: z.string(),
  club: z.string(),
  participants: z.array(participantSchema).min(1),
  boat: z.string(),
  preferredBlock: z.number().min(1).max(3),
  boatType: z.enum(boatTypes),
  helm: participantSchema.nullable(),
  gender: z.enum(genders),
  unsubscribed: z.boolean().optional(),
});

export type ParticipantSchema = z.infer<typeof participantSchema>;

export interface TeamAddFormParticipant extends ParticipantSchema {
  id?: string;
}

export type TeamAddForm = z.infer<typeof addTeamSchema>;
