import { AgeItem, AgeType } from './settings';
import { calculateAgeType } from '@utils';
import { DateTime } from 'luxon';

export interface Participant {
  name: string;
  id: string;
  club: string;
  birthYear: number;
  blocks: Set<number>;
  ageType?: AgeType;
  wedstrijdId: string;
}

export function getAgeParticipant(participant: Participant) {
  return DateTime.now().year - participant.birthYear;
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

export function getParticipantForm({ name, birthYear, club, id }: Participant) {
  return { id, name, birthYear, club };
}
