import { getAgeParticipant, getAgeType, Participant } from './participant';
import { Boat } from './boat';
import { AgeItem, AgeType, BoatType } from './settings';
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
  preferredBlock?: number;
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

  if (oneBelow22 && age > 27) return AgeType.open;

  return calculateAgeType(ages, age);
}

export function getTimeResult(isA: boolean, isStart: boolean, time?: string) {
  if (isStart) {
    if (isA) {
      return { startTimeA: time };
    } else {
      return { startTimeB: time };
    }
  } else {
    if (isA) {
      return { finishTimeA: time };
    } else {
      return { finishTimeB: time };
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
