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
  HELM_START,
  HELM_END,
} from "./constants";
import { Stream } from "stream";
import { Boat } from "../models/boat";
import { BoatType } from "../models/settings";

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
      const { participants, helm } = this.addParticipants(
        record,
        participantMap
      );
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
          helm,
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
    const helm = record[HELM_START]
      ? new Participant({
          name: record[HELM_START],
          birthYear: parseInt(record[HELM_START + 1]),
          id: record[HELM_START + 2],
          club: record[HELM_END],
        })
      : null;
    return { participants, helm };
  }

  private getBoatType(type: string): { boatType: BoatType; gender: Gender } {
    const typeWithoutSpaces = type.replaceAll(" ", "").toLowerCase();
    const gender = typeWithoutSpaces.includes("h")
      ? Gender.M
      : typeWithoutSpaces.includes("d")
      ? Gender.F
      : Gender.MIX;

    switch (typeWithoutSpaces) {
      case "h1x":
      case "d1x":
        return { gender, boatType: BoatType.skiff };
      case "mixc4+":
      case "dc4+":
      case "hc4+":
        return { gender, boatType: BoatType.cBoatFourBoardWith };
      case "mix2x":
      case "d2x":
      case "h2x":
        return { gender, boatType: BoatType.boatTwoScull };
      case "mix4+":
      case "d4+":
      case "h4+":
        return { gender, boatType: BoatType.boatFourBoardWith };
      case "mix8+":
      case "d8+":
      case "d8":
      case "h8+":
      case "h8":
        return { gender, boatType: BoatType.boatEightBoardWith };
      default:
        throw Error(`Could not translate: ${type}`);
    }
  }
}

export const bondService = new BondService();
