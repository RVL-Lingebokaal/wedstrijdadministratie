import { AgeItem, AgeType } from "./settings";
import { calculateAgeType } from "../components/utils/ageUtils";

interface ParticipantCreation {
  name: string;
  id: string;
  club: string;
  birthYear: number;
}

export class Participant {
  private name = "";
  private id = "";
  private club = "";
  private birthYear = 1900;
  private ageType: AgeType = AgeType.open;

  constructor({ name, id, club, birthYear }: ParticipantCreation) {
    this.birthYear = birthYear;
    this.id = id;
    this.name = name;
    this.club = club;
  }

  getId() {
    return this.id;
  }

  getDatabaseParticipant() {
    return {
      birthYear: this.birthYear,
      id: this.id,
      name: this.name,
      club: this.club,
    };
  }

  getAge() {
    return new Date().getFullYear() - this.birthYear;
  }

  getAgeType(ages: AgeItem[]) {
    if (!this.ageType) {
      this.calculateAgeType(ages);
    }

    return this.ageType;
  }

  private calculateAgeType(ages: AgeItem[]) {
    this.ageType = calculateAgeType(ages, this.getAge());
  }
}
