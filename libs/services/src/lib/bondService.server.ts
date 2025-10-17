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
import { wedstrijdService } from './wedstrijdService.server';

const PARTICIPANT_KEYS = ['Slag', '2', '3', '4', '5', '6', '7', 'Boeg'];

export class BondService {
  async readBondFile(
    wedstrijdId: string,
    stream: Stream
  ): Promise<{ teams: Team[]; participants: Participant[]; boats: Boat[] }> {
    const wedstrijd = await wedstrijdService.getWedstrijdById(wedstrijdId);

    if (!wedstrijd) {
      throw new Error(`Could not find wedstrijd with id: ${wedstrijdId}`);
    }

    const teams = new Set<Team>();
    const participantMap = new Map<string, Participant>();
    const boats = new Map<string, Boat>();
    const settings = await settingsService.getSettings();

    const parser = parse({ delimiter: ',', trim: true, columns: true });
    const records = stream.pipe(parser);
    let row = 1;
    for await (const record of records) {
      row++;
      const { participants, helm, preferredBlock } = this.addParticipants(
        record,
        participantMap,
        wedstrijdId
      );

      let boatId: null | string = null;

      this.checkRecord(record, row);

      if (record[BOAT_NAME] !== '-') {
        let boat: Boat = {
          club: record[TEAM_CLUB],
          name: record[BOAT_NAME],
          blocks: new Set([preferredBlock]),
          id: getBoatId(record[BOAT_NAME], record[TEAM_CLUB]),
          wedstrijdId,
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
        Boolean(helm),
        wedstrijd.settings.general.isJeugd
      );
      const ageClass = getAgeClassTeam({ participants, ages: settings.ages });

      teams.add({
        name: record[TEAM_NAME],
        id: record[TEAM_ID],
        club: record[TEAM_CLUB],
        participants,
        boat: boatId ? boats.get(boatId) : null,
        registrationFee: record[TEAM_REGISTRATION_FEE] ?? 0,
        remarks: record[TEAM_REMARKS] ?? null,
        coach: record[TEAM_COACH] ?? null,
        preferredBlock,
        phoneNumber: record[TEAM_PHONE_NUMBER] ?? null,
        boatType,
        gender,
        helm,
        place: 0,
        ageClass,
        wedstrijdId,
        block: preferredBlock,
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
    map: Map<string, Participant>,
    wedstrijdId: string
  ) {
    const participants: Participant[] = [];
    let overrideBlock: undefined | number = undefined;
    PARTICIPANT_KEYS.forEach((key) => {
      const rec = record[key];
      if (rec && rec !== '') {
        const { participant, newBlock } = this.createParticipant(
          record,
          key,
          map,
          wedstrijdId,
          overrideBlock
        );
        overrideBlock = newBlock;
        if (overrideBlock !== undefined && overrideBlock !== newBlock) {
          throw new Error(
            `I need to do something: ${overrideBlock} ${newBlock} ${record[TEAM_ID]}`
          );
        }
        participants.push(participant);
      }
    });

    const rec = record[HELM];
    const helm =
      rec && rec !== ''
        ? this.createParticipant(
            record,
            HELM,
            map,
            wedstrijdId,
            overrideBlock ?? 1
          )
        : null;

    return {
      participants,
      helm: helm?.participant ?? null,
      preferredBlock: overrideBlock ?? 1,
    };
  }

  private createParticipant(
    record: Record<string, string>,
    path: string,
    map: Map<string, Participant>,
    wedstrijdId: string,
    overrideBlock?: number
  ) {
    let preferredBlock = record[TEAM_PREFFERED_BLOCK]
      ? parseInt(record[TEAM_PREFFERED_BLOCK])
      : null;
    preferredBlock = overrideBlock ?? preferredBlock ?? 1;
    const id = record[`NKODE ${path}`];
    let initialParticipant = map.get(id) ?? {
      name: record[path],
      birthYear: parseInt(
        record[`geb${isNaN(parseInt(path)) ? '' : ' '}${path}`]
      ),
      id,
      club: record[`VKODE ${path}`],
      blocks: record[TEAM_PREFFERED_BLOCK]
        ? new Set([parseInt(record[TEAM_PREFFERED_BLOCK])])
        : new Set(),
      wedstrijdId,
    };
    const { participant, newBlock } = this.addBlockParticipant(
      preferredBlock,
      initialParticipant
    );
    map.set(id, participant);
    return { participant, newBlock };
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
    helm: boolean,
    isJeugd?: boolean
  ): { boatType: BoatType; gender: Gender } {
    const typeWithoutSpaces = type.replaceAll(' ', '').toLowerCase();
    const gender = this.getGender(typeWithoutSpaces, isJeugd);

    switch (typeWithoutSpaces) {
      case 'h1x':
      case 'd1x':
      case 'm1x':
      case 'v1x':
      case 'j121x':
      case 'j141x':
      case 'j161x':
      case 'j181x':
      case 'm121x':
      case 'm141x':
      case 'm161x':
      case 'm181x':
        if (amountOfParticipants === 1 && !helm) {
          return { gender, boatType: '1x' };
        }
        throw new BoatTypeError({
          boatType: '1x',
          helm,
          amountOfParticipants,
        });
      case 'mixc4+':
      case 'dc4+':
      case 'hc4+':
      case 'oc4+':
      case 'mc4+':
      case 'vc4+':
      case 'j12c4+':
      case 'j14c4+':
      case 'j16c4+':
      case 'j18c4+':
      case 'm12c4+':
      case 'm14c4+':
      case 'm16c4+':
      case 'm18c4+':
      case 'mix12c4+':
      case 'mix14c4+':
      case 'mix16c4+':
      case 'mix18c4+':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: 'C4+' };
        }
        throw new BoatTypeError({
          boatType: 'C4+',
          helm,
          amountOfParticipants,
        });
      case 'mixc4x':
      case 'dc4x':
      case 'hc4x':
      case 'oc4x':
      case 'mc4x':
      case 'vc4x':
      case 'j12c4x':
      case 'j14c4x':
      case 'j16c4x':
      case 'j18c4x':
      case 'm12c4x':
      case 'm14c4x':
      case 'm16c4x':
      case 'm18c4x':
      case 'mix12c4x':
      case 'mix14c4x':
      case 'mix16c4x':
      case 'mix18c4x':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: 'C4*' };
        }
        throw new BoatTypeError({
          boatType: 'C4*',
          helm,
          amountOfParticipants,
        });
      case 'mixc4*':
      case 'dc4*':
      case 'hc4*':
      case 'oc4*':
      case 'mc4*':
      case 'vc4*':
      case 'j12c4*':
      case 'j14c4*':
      case 'j16c4*':
      case 'j18c4*':
      case 'm12c4*':
      case 'm14c4*':
      case 'm16c4*':
      case 'm18c4*':
      case 'mix12c4*':
      case 'mix14c4*':
      case 'mix16c4*':
      case 'mix18c4*':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: 'C4*' };
        }
        throw new BoatTypeError({
          boatType: 'C4*',
          helm,
          amountOfParticipants,
        });
      case 'mix2x':
      case 'd2x':
      case 'h2x':
      case 'm2x':
      case 'v2x':
      case 'j122x':
      case 'j142x':
      case 'j162x':
      case 'j182x':
      case 'm122x':
      case 'm142x':
      case 'm162x':
      case 'm182x':
      case 'mix122x':
      case 'mix142x':
      case 'mix162x':
      case 'mix182x':
        if (amountOfParticipants === 2 && !helm) {
          return { gender, boatType: '2x' };
        }
        throw new BoatTypeError({
          boatType: '2x',
          helm,
          amountOfParticipants,
        });
      case 'mix4+':
      case 'd4+':
      case 'h4+':
      case 'o4+':
      case 'm4+':
      case 'v4+':
      case 'j124+':
      case 'j144+':
      case 'j164+':
      case 'j184+':
      case 'm124+':
      case 'm144+':
      case 'm164+':
      case 'm184+':
      case 'mix124+':
      case 'mix144+':
      case 'mix164+':
      case 'mix184+':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: '4+' };
        }
        throw new BoatTypeError({
          boatType: '4+',
          helm,
          amountOfParticipants,
        });
      case 'mix4*':
      case 'd4*':
      case 'h4*':
      case 'o4*':
      case 'm4*':
      case 'v4*':
      case 'j124*':
      case 'j144*':
      case 'j164*':
      case 'j184*':
      case 'm124*':
      case 'm144*':
      case 'm164*':
      case 'm184*':
      case 'mix124*':
      case 'mix144*':
      case 'mix164*':
      case 'mix184*':
        if (amountOfParticipants === 4 && helm) {
          return { gender, boatType: '4*' };
        }
        throw new BoatTypeError({
          boatType: '4*',
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
      case 'j128+':
      case 'j148+':
      case 'j168+':
      case 'j188+':
      case 'm128+':
      case 'm148+':
      case 'm168+':
      case 'm188+':
      case 'mix128+':
      case 'mix148+':
      case 'mix168+':
      case 'mix188+':
        if (amountOfParticipants === 8 && helm) {
          return { gender, boatType: '8+' };
        }
        throw new BoatTypeError({
          boatType: '8+',
          helm,
          amountOfParticipants,
        });
      case 'mix8*':
      case 'd8*':
      case 'h8*':
      case 'o8*':
      case 'v8*':
      case 'm8*':
      case 'j128*':
      case 'j148*':
      case 'j168*':
      case 'j188*':
      case 'm128*':
      case 'm148*':
      case 'm168*':
      case 'm188*':
      case 'mix128*':
      case 'mix148*':
      case 'mix168*':
      case 'mix188*':
        if (amountOfParticipants === 8 && helm) {
          return { gender, boatType: '8*' };
        }
        throw new BoatTypeError({
          boatType: '8*',
          helm,
          amountOfParticipants,
        });
      default:
        throw Error(`Could not translate: ${type}`);
    }
  }

  private getGender(type: string, isJeugd?: boolean): Gender {
    const isMix = type.includes('mix');
    const isOpen = type.includes('o');
    const isFemale = isJeugd
      ? type.includes('m')
      : type.includes('d') || type.includes('v');

    if (isMix) return 'mix';
    if (isFemale) return 'female';
    if (isOpen) return 'open';
    return 'male';
  }

  private addBlockParticipant(
    block: number,
    participant: Participant
  ): { participant: Participant; newBlock: number } {
    if (participant.blocks.has(block)) {
      return this.addBlockParticipant(block + 1, participant);
    }

    participant.blocks.add(block);
    return { participant, newBlock: block };
  }
}

export const bondService = new BondService();
