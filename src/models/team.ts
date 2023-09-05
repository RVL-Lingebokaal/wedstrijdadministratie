import { Participant } from "./participant";
import { Boat } from "./boat";
import { AgeItem, BoatTypes } from "./settings";
import { calculateAgeType } from "../components/utils/ageUtils";

export enum Gender {
  M = "male",
  F = "female",
  MIX = "mix",
}

interface TeamCreation {
  name: string;
  id: string;
  club: string;
  participants: Participant[];
  boat: Boat;
  registrationFee: number;
  preferredBlock: number;
  coach: string;
  phoneNumber: string;
  remarks: string;
  boatType: BoatTypes;
  gender: Gender;
  helm: Participant | null;
}

export class Team {
  private name = "";
  private id = "";
  private club = "";
  private participants: Participant[] = [];
  private boat: null | Boat = null;
  private registrationFee = 0;
  private preferredBlock = 0;
  private coach = "";
  private phoneNumber = "";
  private remarks = "";
  private boatType: null | BoatTypes = null;
  private gender: null | Gender = null;
  private helm: null | Participant = null;

  constructor({
    name,
    id,
    club,
    participants,
    boat,
    registrationFee,
    coach,
    phoneNumber,
    preferredBlock,
    remarks,
    boatType,
    gender,
    helm,
  }: TeamCreation) {
    this.name = name;
    this.id = id;
    this.club = club;
    this.participants = participants;
    this.boat = boat;
    this.registrationFee = registrationFee;
    this.coach = coach;
    this.phoneNumber = phoneNumber;
    this.remarks = remarks;
    this.preferredBlock = preferredBlock;
    this.boatType = boatType;
    this.gender = gender;
    this.helm = helm ?? null;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getBoatType() {
    return this.boatType;
  }

  getAgeClass(ages: AgeItem[]) {
    if (this.participants.length === 1) {
      return this.participants[0].getAgeType(ages);
    }
    const total = this.participants.reduce(
      (acc, participant) => acc + participant.getAge(),
      0
    );
    const age = total / this.participants.length;
    return calculateAgeType(ages, age);
  }

  getDatabaseTeam() {
    return {
      id: this.id,
      name: this.name,
      club: this.club,
      participants: this.participants.map((participant) => participant.getId()),
      boat: this.boat?.getId() ?? "",
      registrationFee: this.registrationFee,
      coach: this.coach,
      phoneNumber: this.phoneNumber,
      remarks: this.remarks,
      preferredBlock: this.preferredBlock,
      boatType: this.boatType,
      gender: this.gender,
      helm: this.helm?.getId(),
    };
  }
}
