import { Participant } from "./participant";
import { Boat } from "./boat";
import { BoatTypes } from "./settings";

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
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
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
    };
  }
}
