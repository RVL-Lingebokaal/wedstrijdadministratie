import { AgeItem, AgeType } from "./settings";
import { calculateAgeType } from "../components/utils/ageUtils";

export interface ParticipantCreation {
  name: string;
  id: string;
  club: string;
  birthYear: number;
  preferredBlock: number;
  blocks?: Set<number>;
}

export class Participant {
  private name = "";
  private id = "";
  private club = "";
  private birthYear = 1900;
  private ageType: AgeType | undefined = undefined;
  private blocks: Set<number> = new Set();

  constructor({
    name,
    id,
    club,
    birthYear,
    preferredBlock,
    blocks,
  }: ParticipantCreation) {
    this.birthYear = birthYear;
    this.id = id;
    this.name = name;
    this.club = club;
    this.blocks = blocks ? blocks : this.blocks.add(preferredBlock);
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
      preferredBlocks: Array.from(this.blocks.entries()),
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

  addBlock(block: number) {
    if (this.blocks.has(block)) {
      throw new Error("This block is already taken");
    }
    this.blocks.add(block);
  }

  private calculateAgeType(ages: AgeItem[]) {
    this.ageType = calculateAgeType(ages, this.getAge());
  }
}
