import { AgeItem, AgeType } from "./settings";
import { calculateAgeType } from "../components/utils/ageUtils";

export interface Participant {
  name: string;
  id: string;
  club: string;
  birthYear: number;
  blocks: Set<number>;
  ageType?: AgeType;
}

export function getAgeParticipant(participant: Participant) {
  return new Date().getFullYear() - participant.birthYear;
}

interface GetAgeTypesProps {
  participant: Participant;
  ages: AgeItem[];
}
export function getAgeType({ participant, ages }: GetAgeTypesProps) {
  if (participant.ageType) {
    return participant.ageType;
  }
  const age = new Date().getFullYear() - participant.birthYear;
  return calculateAgeType(ages, age);
}
