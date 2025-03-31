import { parse } from 'csv-parse';
import {
  Boat,
  BoatType,
  BoatTypeError,
  BondFileError,
  Gender,
  getAgeClassTeam,
  getBoatId,
  Participant,
  Team,
} from '@models';
import {
  BOAT_NAME,
  HELM,
  TEAM_CLUB,
  TEAM_COACH,
  TEAM_COMPETITION_CODE,
  TEAM_ID,
  TEAM_NAME,
  TEAM_PHONE_NUMBER,
  TEAM_PREFFERED_BLOCK,
  TEAM_REGISTRATION_FEE,
  TEAM_REMARKS,
} from './constants';
import { Stream } from 'stream';
import { addBlock } from '@utils';
import { settingsService } from './settingsService.server';

const PARTICIPANT_KEYS = ['Slag', '2', '3', '4', '5', '6', '7', 'Boeg'];

export class BondService {
  async readBondFile(
    stream: Stream
  ): Promise<{ teams: Team[]; participants: Participant[]; boats: Boat[] }> {
    const teams = new Set<Team>();
    const participantMap = new Map<string, Participant>();
    const boats = new Map<string, Boat>();
    const settings = await settingsService.getSettings();

    const parser = parse({ delimiter: ',', trim: true, columns: true });
    const records = stream.pipe(parser);
    let row = 1;
    for await (const record of records) {
      row++;
      const { participants, helm } = this.addParticipants(
        record,
        participantMap
      );

      let boatId: null | string = null;

      this.checkRecord(record, row);

      if (record[BOAT_NAME] !== '-') {
        let boat: Boat = {
          club: record[TEAM_CLUB],
          name: record[BOAT_NAME],
          blocks: new Set([parseInt(record[TEAM_PREFFERED_BLOCK])]),
          id: getBoatId(record[BOAT_NAME], record[TEAM_CLUB]),
        };
        boatId = boat.id;
        if (boats.has(boatId)) {
          const oldBoat = boats.get(boatId);
          if (oldBoat) {
            boat = Array.from(oldBoat.blocks).reduce(
              (boat, block) =>
                addBlock<Boat>({ object: boat, block, reset: true }),
              boat
            );
          }
        }
        boats.set(boatId, boat);
      }

      const { gender, boatType } = this.getBoatType(
        record[TEAM_COMPETITION_CODE],
        participants.length,
        Boolean(helm)
      );
      const ageClass = getAgeClassTeam({ participants, ages: settings.ages });

      teams.add({
        name: record[TEAM_NAME],
        id: record[TEAM_ID],
        club: record[TEAM_CLUB],
        participants,
        boat: boatId ? boats.get(boatId) : null,
        registrationFee: record[TEAM_REGISTRATION_FEE],
        remarks: record[TEAM_REMARKS],
        coach: record[TEAM_COACH],
        preferredBlock: record[TEAM_PREFFERED_BLOCK]
          ? parseInt(record[TEAM_PREFFERED_BLOCK])
          : undefined,
        phoneNumber: record[TEAM_PHONE_NUMBER],
        boatType,
        gender,
        helm,
        place: 0,
        ageClass,
      });
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
      if (rec && rec !== '') {
        const participant = this.createParticipant(record, key, map);
        participants.push(participant);
      }
    });

    const rec = record[HELM];
    const helm =
      rec && rec !== '' ? this.createParticipant(record, HELM, map) : null;

    return { participants, helm };
  }

  private createParticipant(
    record: Record<string, string>,
    path: string,
    map: Map<string, Participant>
  ) {
    const id = record[`NKODE ${path}`];
    let participant = map.get(id) ?? {
      name: record[path],
      birthYear: parseInt(
        record[`geb${isNaN(parseInt(path)) ? '' : ' '}${path}`]
      ),
      id,
      club: record[`VKODE ${path}`],
      blocks: new Set([parseInt(record[TEAM_PREFFERED_BLOCK])]),
    };
    participant = addBlock<Participant>({
      object: participant,
      block: parseInt(record[TEAM_PREFFERED_BLOCK]),
      reset: true,
    });
    map.set(id, participant);
    return participant;
  }

  private checkRecord(record: any, row: number) {
    if (!record[BOAT_NAME]) {
      throw new BondFileError({
        name: BOAT_NAME,
        message: 'Er is geen bootnaam ingevuld',
        row,
      });
    }

    if (!record[TEAM_CLUB]) {
      throw new BondFileError({
        name: TEAM_CLUB,
        message: 'Er is geen verenigingsnaam ingevuld',
        row,
      });
    }

    if (!record[TEAM_COMPETITION_CODE]) {
      throw new BondFileError({
        name: TEAM_COMPETITION_CODE,
        message: 'Er is geen wedstrijdcode ingevuld',
        row,
      });
    }
  }

  private getBoatType(
    type: string,
    amountOfParticipants: number,
    helm: boolean
  ): { boatType: BoatType; gender: Gender } {
    const typeWithoutSpaces = type.replaceAll(' ', '').toLowerCase();
    const gender = this.getGender(typeWithoutSpaces);

    switch (typeWithoutSpaces) {
      case 'h1x':
      case 'd1x':
      case 'm1x':
      case 'v1x':
        if (amountOfParticipants === 1 && !helm) {
          return { gender, boatType: BoatType.skiff };
        }
        throw new BoatTypeError({
          boatType: BoatType.skiff,
          helm,
          amountOfParticipants,
        });
      case 'mixc4+':
      case 'dc4+':
      case 'hc4+':
      case 'oc4+':
      case 'mc4+':
      case 'vc4+':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: BoatType.boardFourWithC };
        }
        throw new BoatTypeError({
          boatType: BoatType.boardFourWithC,
          helm,
          amountOfParticipants,
        });
      case 'mixc4x':
      case 'dc4x':
      case 'hc4x':
      case 'oc4x':
      case 'mc4x':
      case 'vc4x':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: BoatType.boardFourWithC };
        }
        throw new BoatTypeError({
          boatType: BoatType.boardFourWithC,
          helm,
          amountOfParticipants,
        });
      case 'mixc4*':
      case 'dc4*':
      case 'hc4*':
      case 'oc4*':
      case 'mc4*':
      case 'vc4*':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: BoatType.scullFourWithC };
        }
        throw new BoatTypeError({
          boatType: BoatType.scullFourWithC,
          helm,
          amountOfParticipants,
        });
      case 'mix2x':
      case 'd2x':
      case 'h2x':
      case 'm2x':
      case 'v2x':
        if (amountOfParticipants === 2 && !helm) {
          return { gender, boatType: BoatType.scullTwoWithout };
        }
        throw new BoatTypeError({
          boatType: BoatType.scullTwoWithout,
          helm,
          amountOfParticipants,
        });
      case 'mix4+':
      case 'd4+':
      case 'h4+':
      case 'o4+':
      case 'm4+':
      case 'v4+':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: BoatType.boardFourWith };
        }
        throw new BoatTypeError({
          boatType: BoatType.boardFourWith,
          helm,
          amountOfParticipants,
        });
      case 'mix4*':
      case 'd4*':
      case 'h4*':
      case 'o4*':
      case 'm4*':
      case 'v4*':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: BoatType.scullFourWith };
        }
        throw new BoatTypeError({
          boatType: BoatType.scullFourWith,
          helm,
          amountOfParticipants,
        });
      case 'mix8+':
      case 'd8+':
      case 'd8':
      case 'h8+':
      case 'h8':
      case 'o8+':
      case 'm8+':
      case 'v8+':
        if (amountOfParticipants === 8 && helm) {
          return { gender, boatType: BoatType.boardEightWith };
        }
        throw new BoatTypeError({
          boatType: BoatType.boardEightWith,
          helm,
          amountOfParticipants,
        });
      case 'mix8*':
      case 'd8*':
      case 'h8*':
      case 'o8*':
      case 'v8*':
      case 'm8*':
        if (amountOfParticipants === 8 && helm) {
          return { gender, boatType: BoatType.scullEightWith };
        }
        throw new BoatTypeError({
          boatType: BoatType.scullEightWith,
          helm,
          amountOfParticipants,
        });
      default:
        throw Error(`Could not translate: ${type}`);
    }
  }

  private getGender(type: string) {
    const isFemale = type.includes('D') || type.includes('V');
    const isMix = type.includes('Mix');
    if (isMix) return Gender.MIX;
    if (isFemale) return Gender.F;
    return Gender.M;
  }
}

export const bondService = new BondService();
