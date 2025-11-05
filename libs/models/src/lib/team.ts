import { getAgeParticipant, getAgeType, Participant } from './participant';
import { Boat } from './boat';
import { AgeItem, AgeType, ageTypes, BoatType, Gender } from './settings';
import { calculateAgeType } from '@utils';
import { z } from 'zod';

export const teamTimesSchema = z.object({
  startTimeA: z.number().nullable().optional(),
  startTimeB: z.number().nullable().optional(),
  finishTimeA: z.number().nullable().optional(),
  finishTimeB: z.number().nullable().optional(),
  useStartA: z.boolean().optional(),
  useFinishA: z.boolean().optional(),
  processed: z.boolean().optional(),
});
export type TeamTimes = z.infer<typeof teamTimesSchema>;

export interface TeamResult {
  name: string;
  id: string;
  result?: TeamTimes;
}

export interface Team extends TeamResult {
  club: string;
  participants: Participant[];
  boat?: Boat | null;
  registrationFee: number;
  preferredBlock?: number | null;
  coach?: string;
  phoneNumber: string;
  remarks: string;
  boatType: BoatType;
  gender: Gender;
  helm: Participant | null;
  place: number;
  block?: null | number;
  startNumber?: number;
  ageClass: AgeType;
  wedstrijdId: string;
  unsubscribed?: boolean;
}

export function getDatabaseTeam(team: Team) {
  return {
    ...team,
    helm: team.helm?.id ?? null,
    boat: team.boat?.id ?? null,
    participants: team.participants.map(({ id }) => id),
    result: team.result ?? null,
    startNumber: team.startNumber ?? null,
  };
}

interface GetAgeClassTeamsProps {
  ages: AgeItem[];
  participants: Participant[];
}

export function getAgeClassTeam({ ages, participants }: GetAgeClassTeamsProps) {
  if (participants.length === 1) {
    return getAgeType({ participant: participants[0], ages });
  }
  let oneBelow22 = false;
  const total = participants.reduce((acc, participant) => {
    const age = getAgeParticipant(participant);

    if (age < 22) {
      oneBelow22 = true;
    }

    return acc + age;
  }, 0);
  const age = total / participants.length;

  if (oneBelow22 && age > 27) return '-';

  return calculateAgeType(ages, age);
}

export function getTimeResult(isA: boolean, isStart: boolean, time?: number) {
  if (isStart) {
    if (isA) {
      return { startTimeA: time ?? null };
    } else {
      return { startTimeB: time ?? null };
    }
  } else {
    if (isA) {
      return { finishTimeA: time ?? null };
    } else {
      return { finishTimeB: time ?? null };
    }
  }
}

export function getTimeKey(isA: boolean, isStart: boolean) {
  if (isStart) {
    return isA ? 'startTimeA' : 'startTimeB';
  } else {
    return isA ? 'finishTimeA' : 'finishTimeB';
  }
}

export function getSpecificTimeResultFromTeam(
  isA: boolean,
  isStart: boolean,
  team: Team
) {
  if (isStart) {
    if (isA) {
      return team.result?.startTimeA;
    } else {
      return team.result?.startTimeB;
    }
  } else {
    if (isA) {
      return team.result?.finishTimeA;
    } else {
      return team.result?.finishTimeB;
    }
  }
}

export interface Time {
  id: string;
  time: string;
}

export interface StartNumberTime extends Time {
  startNumber: number;
  club: string;
  teamId: string;
}

export interface SaveStartNumberTime extends StartNumberTime {
  isA: boolean;
  isStart: boolean;
}

export interface PostTimeProps extends Time {
  type: 'restore' | 'delete' | 'duplicate';
  teamId?: string;
  isA?: boolean;
  isStart?: boolean;
}

export function translateGenderToShort(
  gender: Gender,
  isJeugdWedstrijd: boolean
) {
  switch (gender) {
    case 'male':
      return isJeugdWedstrijd ? 'J' : 'H';
    case 'female':
      return isJeugdWedstrijd ? 'M' : 'D';
    case 'mix':
      return 'Mix';
    default:
      return 'Open';
  }
}

export const getResultsForTeamsSchema = z.object({
  teamsResult: z.array(
    z.object({
      id: z.string(),
      startNr: z.number(),
      name: z.string(),
      slag: z.string().nullable(),
      difference: z.string().nullable(),
      ageClass: z.enum(ageTypes),
      block: z.number().nullable(),
      className: z.string(),
      correction: z.string().nullable(),
      result: teamTimesSchema.optional(),
    })
  ),
});
export type GetResultsForTeamsResponseDto = z.infer<
  typeof getResultsForTeamsSchema
>;
export const postResultsForTeamSchema = z.object({
  id: z.string(),
  useStartA: z.boolean(),
  useFinishA: z.boolean(),
  processed: z.boolean().optional(),
});
export type PostResultsForTeamDto = z.infer<typeof postResultsForTeamSchema>;

export const postResultsForChangeEntireBlockSchema = z.object({
  isA: z.boolean(),
  isStart: z.boolean(),
  block: z.number(),
});
export type PostResultsForChangeEntireBlockDto = z.infer<
  typeof postResultsForChangeEntireBlockSchema
>;
