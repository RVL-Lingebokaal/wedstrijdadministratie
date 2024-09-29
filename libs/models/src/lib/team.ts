import { getAgeParticipant, getAgeType, Participant } from './participant';
import { Boat } from './boat';
import { AgeItem, BoatType } from './settings';
import { calculateAgeType } from '@utils';

export enum Gender {
  M = 'male',
  MIX = 'mix',
  F = 'female',
}

export interface TeamTimes {
  startTimeA?: string;
  startTimeB?: string;
  finishTimeA?: string;
  finishTimeB?: string;
}

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
  preferredBlock: number;
  coach?: string;
  phoneNumber: string;
  remarks: string;
  boatType: BoatType;
  gender: Gender;
  helm: Participant | null;
  place: number;
  block?: null | number;
  startNumber?: number;
}

export function getDatabaseTeam(team: Team) {
  return {
    ...team,
    helm: team.helm?.id ?? null,
    boat: team.boat?.id ?? null,
    participants: team.participants.map(({ id }) => id),
    result: team.result ?? null,
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
  const total = participants.reduce(
    (acc, participant) => acc + getAgeParticipant(participant),
    0
  );
  const age = total / participants.length;
  return calculateAgeType(ages, age);
}
