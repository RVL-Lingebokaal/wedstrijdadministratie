import { parse } from "csv-parse";
import { Gender, Team } from "../models/team";
import { Participant } from "../models/participant";
import {
  BOAT_NAME,
  PARTICIPANT_END,
  PARTICIPANT_START,
  TEAM_COACH,
  TEAM_COMPETITION_CODE,
  TEAM_ID,
  TEAM_NAME,
  TEAM_PHONE_NUMBER,
  TEAM_PREFFERED_BLOCK,
  TEAM_REGISTRATION_FEE,
  TEAM_REMARKS,
  TEAM_CLUB,
} from "./constants";
import { Stream } from "stream";
import { Boat } from "../models/boat";
import { BoatTypes } from "../models/settings";

export class BondService {
  async readBondFile(
    stream: Stream
  ): Promise<{ teams: Team[]; participants: Participant[]; boats: Boat[] }> {
    const teams = new Set<Team>();
    const participantMap = new Map<string, Participant>();
    const boats = new Map<string, Boat>();

    const parser = parse({ delimiter: ",", trim: true });
    const records = stream.pipe(parser);
    for await (const record of records) {
      if (record[0] === "PloegId") {
        continue;
      }
      const participants = this.addParticipants(record, participantMap);
      const boat = new Boat({
        club: record[TEAM_CLUB],
        name: record[BOAT_NAME],
      });
      const boatId = boat.getId();
      if (!boats.has(boatId)) {
        boats.set(boatId, boat);
      }
      const { gender, boatType } = this.getBoatType(
        record[TEAM_COMPETITION_CODE]
      );
      teams.add(
        new Team({
          name: record[TEAM_NAME],
          id: record[TEAM_ID],
          club: record[TEAM_CLUB],
          participants,
          boat: boats.get(boatId) ?? boat,
          registrationFee: record[TEAM_REGISTRATION_FEE],
          remarks: record[TEAM_REMARKS],
          coach: record[TEAM_COACH],
          preferredBlock: record[TEAM_PREFFERED_BLOCK],
          phoneNumber: record[TEAM_PHONE_NUMBER],
          boatType,
          gender,
        })
      );
    }
    return {
      teams: Array.from(teams),
      participants: Array.from(participantMap.values()),
      boats: Array.from(boats.values()),
    };
  }

  private addParticipants(record: string[], map: Map<string, Participant>) {
    const participants: Participant[] = [];
    for (let i = PARTICIPANT_START; i < PARTICIPANT_END; i = i + 4) {
      const name = record[i];
      const id = record[i + 2];
      if (!name) {
        continue;
      }
      const participant =
        map.get(id) ??
        new Participant({
          name,
          birthYear: parseInt(record[i + 1]),
          id,
          club: record[i + 3],
        });

      map.set(id, participant);
      participants.push(participant);
    }
    return participants;
  }

  private getBoatType(type: string): { boatType: BoatTypes; gender: Gender } {
    const typeWithoutSpaces = type.replaceAll(" ", "").toLowerCase();
    const gender = typeWithoutSpaces.includes("h")
      ? Gender.M
      : typeWithoutSpaces.includes("d")
      ? Gender.F
      : Gender.MIX;

    switch (typeWithoutSpaces) {
      case "hc1x":
      case "dc1x":
        return { gender, boatType: BoatTypes.cBoatOne };
      case "h1x":
      case "d1x":
        return { gender, boatType: BoatTypes.skiff };
      case "mixc2*":
      case "dc2*":
      case "hc2*":
        return { gender, boatType: BoatTypes.cBoatTwoWith };
      case "mixc2x":
      case "dc2x":
      case "hc2x":
        return { gender, boatType: BoatTypes.cBoatTwoScull };
      case "mixc4*":
      case "dc4*":
      case "hc4*":
        return { gender, boatType: BoatTypes.cBoatFourWith };
      case "mixc4+":
      case "dc4+":
      case "hc4+":
        return { gender, boatType: BoatTypes.cBoatFourBoardWith };
      case "mix2-":
      case "d2-":
      case "h2-":
        return { gender, boatType: BoatTypes.boatTwoBoard };
      case "mix2x":
      case "d2x":
      case "h2x":
        return { gender, boatType: BoatTypes.boatTwoScull };
      case "mix4+":
      case "d4+":
      case "h4+":
        return { gender, boatType: BoatTypes.boatFourBoardWith };
      case "mix4-":
      case "d4-":
      case "h4-":
        return { gender, boatType: BoatTypes.boatFourBoard };
      case "mix4*":
      case "d4*":
      case "h4*":
        return { gender, boatType: BoatTypes.boatFourWith };
      case "mix4x-":
      case "d4x-":
      case "h4x-":
        return { gender, boatType: BoatTypes.boatFour };
      case "mix8+":
      case "d8+":
      case "d8":
      case "h8+":
      case "h8":
        return { gender, boatType: BoatTypes.boatEightBoardWith };
      case "mix8*":
      case "d8*":
      case "h8*":
        return { gender, boatType: BoatTypes.boatEightWith };
      default:
        throw Error(`Could not translate: ${type}`);
    }
  }
}

export const bondService = new BondService();
