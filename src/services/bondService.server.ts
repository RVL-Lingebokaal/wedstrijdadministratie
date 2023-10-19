import { parse } from "csv-parse";
import { Gender, Team } from "../models/team";
import { Participant } from "../models/participant";
import {
  BOAT_NAME,
  TEAM_COACH,
  TEAM_COMPETITION_CODE,
  TEAM_ID,
  TEAM_NAME,
  TEAM_PHONE_NUMBER,
  TEAM_PREFFERED_BLOCK,
  TEAM_REGISTRATION_FEE,
  TEAM_REMARKS,
  TEAM_CLUB,
  HELM,
} from "./constants";
import { Stream } from "stream";
import { Boat } from "../models/boat";
import { BoatType } from "../models/settings";

const PARTICIPANT_KEYS = ["Slag", "2", "3", "4", "5", "6", "7", "Boeg"];

export class BondService {
  async readBondFile(
    stream: Stream
  ): Promise<{ teams: Team[]; participants: Participant[]; boats: Boat[] }> {
    const teams = new Set<Team>();
    const participantMap = new Map<string, Participant>();
    const boats = new Map<string, Boat>();

    const parser = parse({ delimiter: ",", trim: true, columns: true });
    const records = stream.pipe(parser);
    for await (const record of records) {
      const { participants, helm } = this.addParticipants(
        record,
        participantMap
      );

      const boat = new Boat({
        club: record[TEAM_CLUB],
        name: record[BOAT_NAME],
        blocks: [parseInt(record[TEAM_PREFFERED_BLOCK])],
      });
      const boatId = boat.getId();
      if (boats.has(boatId)) {
        const oldBoat = boats.get(boatId);
        if (oldBoat) {
          boat.addBlocks(oldBoat.getBlocks());
        }
      }
      boats.set(boatId, boat);

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
          preferredBlock: parseInt(record[TEAM_PREFFERED_BLOCK]),
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

  private addParticipants(
    record: Record<string, string>,
    map: Map<string, Participant>
  ) {
    const participants: Participant[] = [];
    PARTICIPANT_KEYS.forEach((key) => {
      const rec = record[key];
      if (rec && rec !== "") {
        const participant = this.createParticipant(record, key, map);
        participants.push(participant);
      }
    });

    const rec = record[HELM];
    const helm =
      rec && rec !== "" ? this.createParticipant(record, HELM, map) : null;

    return { participants, helm };
  }

  private createParticipant(
    record: Record<string, string>,
    path: string,
    map: Map<string, Participant>
  ) {
    const id = record[`NKODE ${path}`];
    const participant =
      map.get(id) ??
      new Participant({
        name: record[path],
        birthYear: parseInt(
          record[`geb${isNaN(parseInt(path)) ? "" : " "}${path}`]
        ),
        id,
        club: record[`VKODE ${path}`],
        blocks: new Set([parseInt(record[TEAM_PREFFERED_BLOCK])]),
      });
    participant.addBlock(parseInt(record[TEAM_PREFFERED_BLOCK]), true);
    map.set(id, participant);
    return participant;
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
        return { gender, boatType: BoatType.boardFourWithC };
      case "mixc4x":
      case "dc4x":
      case "hc4x":
        return { gender, boatType: BoatType.boardFourWithC };
      case "mixc4*":
      case "dc4*":
      case "hc4*":
        return { gender, boatType: BoatType.scullFourWithC };
      case "mix2x":
      case "d2x":
      case "h2x":
        return { gender, boatType: BoatType.scullTwoWithout };
      case "mix4+":
      case "d4+":
      case "h4+":
        return { gender, boatType: BoatType.boardFourWith };
      case "mix4*":
      case "d4*":
      case "h4*":
        return { gender, boatType: BoatType.scullFourWith };
      case "mix8+":
      case "d8+":
      case "d8":
      case "h8+":
      case "h8":
        return { gender, boatType: BoatType.boardEightWith };
      case "mix8*":
      case "d8*":
      case "h8*":
        return { gender, boatType: BoatType.scullEightWith };
      default:
        throw Error(`Could not translate: ${type}`);
    }
  }
}

export const bondService = new BondService();
