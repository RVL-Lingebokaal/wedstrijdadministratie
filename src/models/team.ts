import { getAgeParticipant, getAgeType, Participant } from "./participant";
import { Boat } from "./boat";
import { AgeItem, BoatType } from "./settings";
import { calculateAgeType } from "../components/utils/ageUtils";

export enum Gender {
  M = "male",
  F = "female",
  MIX = "mix",
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
  team: Team;
}

export function getAgeClassTeam({ ages, team }: GetAgeClassTeamsProps) {
  if (team.participants.length === 1) {
    return getAgeType({ participant: team.participants[0], ages });
  }
  const total = team.participants.reduce(
    (acc, participant) => acc + getAgeParticipant(participant),
    0
  );
  const age = total / team.participants.length;
  return calculateAgeType(ages, age);
}
