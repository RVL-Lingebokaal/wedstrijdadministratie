import { AgeItem, AgeType } from "./settings";
import { calculateAgeType } from "../components/utils/ageUtils";

export interface ParticipantCreation {
  name: string;
  id: string;
  club: string;
  birthYear: number;
  blocks: Set<number>;
}

export class Participant {
  private name = "";
  private id = "";
  private club = "";
  private birthYear = 1900;
  private ageType: AgeType | undefined = undefined;
  private blocks: Set<number> = new Set();

  constructor({ name, id, club, birthYear, blocks }: ParticipantCreation) {
    this.birthYear = birthYear;
    this.id = id;
    this.name = name;
    this.club = club;
    this.blocks = blocks;
  }

  updateParticipantData({
    birthYear,
    name,
    club,
  }: Partial<ParticipantCreation>) {
    this.birthYear = birthYear ?? this.birthYear;
    this.name = name ?? this.name;
    this.club = club ?? this.club;
  }

  getId() {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getDatabaseParticipant() {
    return {
      birthYear: this.birthYear,
      id: this.id,
      name: this.name,
      club: this.club,
      blocks: JSON.stringify(Array.from(this.blocks.values())),
    };
  }

  getAge() {
    return new Date().getFullYear() - this.birthYear;
  }

  getName() {
    return this.name;
  }

  getClub() {
    return this.club;
  }

  getBirthYear() {
    return this.birthYear;
  }

  getParticipantForm() {
    return {
      name: this.name,
      club: this.club,
      birthYear: this.birthYear,
      id: this.id,
    };
  }

  getAgeType(ages: AgeItem[]) {
    if (!this.ageType) {
      this.calculateAgeType(ages);
    }

    return this.ageType as AgeType;
  }

  addBlock(block: number, reset?: boolean) {
    console.log(this.blocks, this.name);

    if (!reset && this.blocks.has(block)) {
      throw new Error("This block is already taken");
    }
    this.blocks.add(block);
  }

  removeBlock(block: number) {
    this.blocks.delete(block);
  }

  updateBlock(toRemove: number, toAdd: number, reset?: boolean) {
    this.removeBlock(toRemove);
    this.addBlock(toAdd, reset);
  }

  private calculateAgeType(ages: AgeItem[]) {
    this.ageType = calculateAgeType(ages, this.getAge());
  }
}
