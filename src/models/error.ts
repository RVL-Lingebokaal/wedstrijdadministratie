import {
  BOAT_NAME,
  TEAM_CLUB,
  TEAM_COMPETITION_CODE,
} from "../services/constants";
import { BoatType } from "./settings";

type ErrorNameBondFile =
  | typeof BOAT_NAME
  | typeof TEAM_CLUB
  | typeof TEAM_COMPETITION_CODE
  | string;

interface ErrorCreationBondFile {
  name: ErrorNameBondFile;
  message: string;
  row: number;
}

export class BondFileError extends Error {
  name: ErrorNameBondFile;
  message: string;
  row: number;

  constructor({ name, message, row }: ErrorCreationBondFile) {
    super();
    this.message = message;
    this.name = name;
    this.row = row;
  }
}

interface BoatTypeErrorCreation {
  boatType: BoatType;
  amountOfParticipants: number;
  helm: boolean;
}

export class BoatTypeError extends Error {
  boatType: BoatType;
  amountOfParticipants: number;
  helm: boolean;
  message: string;

  constructor({ boatType, amountOfParticipants, helm }: BoatTypeErrorCreation) {
    super();
    this.amountOfParticipants = amountOfParticipants;
    this.boatType = boatType;
    this.helm = helm;
    this.message = `There are an incorrect number of participants for ${this.boatType}. Participants: ${this.amountOfParticipants}. Helm: ${this.helm}`;
  }
}
