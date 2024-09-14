import { BondService } from './bondService.server';
import { Stream } from 'stream';
import csvParse, { Parser } from 'csv-parse';
import { BASIC_CSV_RECORD, CSV_RECORD } from './tests/mocks';
import {
  BOAT_NAME,
  HELM,
  TEAM_CLUB,
  TEAM_COMPETITION_CODE,
  TEAM_PREFFERED_BLOCK,
} from './constants';
import { BoatType } from '../../../models/src/lib/settings';
import { Gender } from '../../../models/src/lib/team';

const mockPipe = jest.fn();
jest.mock('csv-parse', () => ({ parse: jest.fn() }));
describe('BondService', () => {
  beforeEach(() => {
    jest.spyOn(csvParse, 'parse').mockReturnValue({} as Parser);
  });
  const bondService = new BondService();

  it('reads a file with only a header', async () => {
    mockPipe.mockReturnValue([]);

    const { teams, participants, boats } = await bondService.readBondFile({
      pipe: mockPipe,
    } as unknown as Stream);

    expect(teams).toHaveLength(0);
    expect(participants).toHaveLength(0);
    expect(boats).toHaveLength(0);
  });

  it('reads a file with participants', async () => {
    mockPipe.mockReturnValue([CSV_RECORD]);

    const { teams, participants, boats } = await bondService.readBondFile({
      pipe: mockPipe,
    } as unknown as Stream);

    expect(teams).toHaveLength(1);
    expect(participants).toHaveLength(9);
    expect(boats).toHaveLength(1);
  });

  it('reads a file with two rows with the same boat', async () => {
    mockPipe.mockReturnValue([
      CSV_RECORD,
      { ...CSV_RECORD, [TEAM_PREFFERED_BLOCK]: 2 },
    ]);

    const { teams, participants, boats } = await bondService.readBondFile({
      pipe: mockPipe,
    } as unknown as Stream);

    expect(teams).toHaveLength(2);
    expect(participants).toHaveLength(9);
    expect(boats).toHaveLength(1);
    expect(boats[0].blocks.size).toEqual(2);
  });

  it('reads a file with two rows with different boats', async () => {
    mockPipe.mockReturnValue([
      CSV_RECORD,
      { ...CSV_RECORD, [BOAT_NAME]: 'boatName2' },
    ]);

    const { teams, participants, boats } = await bondService.readBondFile({
      pipe: mockPipe,
    } as unknown as Stream);

    expect(teams).toHaveLength(2);
    expect(participants).toHaveLength(9);
    expect(boats).toHaveLength(2);
  });

  it.each([
    {
      name: 'boatname',
      record: { ...CSV_RECORD, [BOAT_NAME]: undefined },
      message: 'Er is geen bootnaam ingevuld',
    },
    {
      name: 'teamclub',
      record: { ...CSV_RECORD, [TEAM_CLUB]: undefined },
      message: 'Er is geen verenigingsnaam ingevuld',
    },
    {
      name: 'wedstrijdcode',
      record: { ...CSV_RECORD, [TEAM_COMPETITION_CODE]: undefined },
      message: 'Er is geen wedstrijdcode ingevuld',
    },
  ])('throws an error because of missing $name', ({ record, message }) => {
    mockPipe.mockReturnValue([record]);

    return expect(
      bondService.readBondFile({
        pipe: mockPipe,
      } as unknown as Stream)
    ).rejects.toThrow(message);
  });

  it.each([
    {
      name: 'h1x',
      amountOfParticipants: 1,
      boatType: BoatType.skiff,
      gender: Gender.M,
    },
    {
      name: 'd1x',
      amountOfParticipants: 1,
      boatType: BoatType.skiff,
      gender: Gender.F,
    },
    {
      name: 'mixc4+',
      amountOfParticipants: 4,
      boatType: BoatType.boardFourWithC,
      gender: Gender.MIX,
    },
    {
      name: 'dc4+',
      amountOfParticipants: 4,
      boatType: BoatType.boardFourWithC,
      gender: Gender.F,
    },
    {
      name: 'hc4+',
      amountOfParticipants: 4,
      boatType: BoatType.boardFourWithC,
      gender: Gender.M,
    },
    {
      name: 'mixc4x',
      amountOfParticipants: 4,
      boatType: BoatType.boardFourWithC,
      gender: Gender.MIX,
    },
    {
      name: 'dc4x',
      amountOfParticipants: 4,
      boatType: BoatType.boardFourWithC,
      gender: Gender.F,
    },
    {
      name: 'hc4x',
      amountOfParticipants: 4,
      boatType: BoatType.boardFourWithC,
      gender: Gender.M,
    },
    {
      name: 'mixc4*',
      amountOfParticipants: 4,
      boatType: BoatType.scullFourWithC,
      gender: Gender.MIX,
    },
    {
      name: 'dc4*',
      amountOfParticipants: 4,
      boatType: BoatType.scullFourWithC,
      gender: Gender.F,
    },
    {
      name: 'hc4*',
      amountOfParticipants: 4,
      boatType: BoatType.scullFourWithC,
      gender: Gender.M,
    },
    {
      name: 'mix2x',
      amountOfParticipants: 2,
      boatType: BoatType.scullTwoWithout,
      gender: Gender.MIX,
    },
    {
      name: 'd2x',
      amountOfParticipants: 2,
      boatType: BoatType.scullTwoWithout,
      gender: Gender.F,
    },
    {
      name: 'h2x',
      amountOfParticipants: 2,
      boatType: BoatType.scullTwoWithout,
      gender: Gender.M,
    },
    {
      name: 'mix4+',
      amountOfParticipants: 4,
      boatType: BoatType.boardFourWith,
      gender: Gender.MIX,
    },
    {
      name: 'd4+',
      amountOfParticipants: 4,
      boatType: BoatType.boardFourWith,
      gender: Gender.F,
    },
    {
      name: 'h4+',
      amountOfParticipants: 4,
      boatType: BoatType.boardFourWith,
      gender: Gender.M,
    },
    {
      name: 'mix4*',
      amountOfParticipants: 4,
      boatType: BoatType.scullFourWith,
      gender: Gender.MIX,
    },
    {
      name: 'd4*',
      amountOfParticipants: 4,
      boatType: BoatType.scullFourWith,
      gender: Gender.F,
    },
    {
      name: 'h4*',
      amountOfParticipants: 4,
      boatType: BoatType.scullFourWith,
      gender: Gender.M,
    },
    {
      name: 'mix8+',
      amountOfParticipants: 8,
      boatType: BoatType.boardEightWith,
      gender: Gender.MIX,
    },
    {
      name: 'd8+',
      amountOfParticipants: 8,
      boatType: BoatType.boardEightWith,
      gender: Gender.F,
    },
    {
      name: 'd8',
      amountOfParticipants: 8,
      boatType: BoatType.boardEightWith,
      gender: Gender.F,
    },
    {
      name: 'h8+',
      amountOfParticipants: 8,
      boatType: BoatType.boardEightWith,
      gender: Gender.M,
    },
    {
      name: 'h8',
      amountOfParticipants: 8,
      boatType: BoatType.boardEightWith,
      gender: Gender.M,
    },
    {
      name: 'mix8*',
      amountOfParticipants: 8,
      boatType: BoatType.scullEightWith,
      gender: Gender.MIX,
    },
    {
      name: 'd8*',
      amountOfParticipants: 8,
      boatType: BoatType.scullEightWith,
      gender: Gender.F,
    },
    {
      name: 'h8*',
      amountOfParticipants: 8,
      boatType: BoatType.scullEightWith,
      gender: Gender.M,
    },
  ])(
    'translate the $name category correctly',
    async ({ amountOfParticipants, name, boatType, gender }) => {
      const record = {
        ...BASIC_CSV_RECORD,
        [TEAM_COMPETITION_CODE]: name,
        ...getParticipantsBasedOnAmount(amountOfParticipants),
      };

      mockPipe.mockReturnValue([record]);

      const { teams, boats } = await bondService.readBondFile({
        pipe: mockPipe,
      } as unknown as Stream);

      expect(teams.length).toEqual(1);
      expect(boats.length).toEqual(1);
      expect(teams[0].boatType).toEqual(boatType);
      expect(teams[0].gender).toEqual(gender);
    }
  );

  it('throws an error, because of no ability to translate boattype', () => {
    const record = {
      ...BASIC_CSV_RECORD,
      [TEAM_COMPETITION_CODE]: 'h7*',
      ...getParticipantsBasedOnAmount(1),
    };
    mockPipe.mockReturnValue([record]);

    return expect(
      bondService.readBondFile({
        pipe: mockPipe,
      } as unknown as Stream)
    ).rejects.toThrow('Could not translate: h7*');
  });

  it.each([
    {
      code: 'h1x',
      amountOfParticipants: 2,
      message:
        'There are an incorrect number of participants for 1x. Participants: 2. Helm: false',
    },
    {
      code: 'mixc4+',
      amountOfParticipants: 2,
      message:
        'There are an incorrect number of participants for C4+. Participants: 2. Helm: false',
    },
    {
      code: 'mixc4x',
      amountOfParticipants: 2,
      message:
        'There are an incorrect number of participants for C4+. Participants: 2. Helm: false',
    },
    {
      code: 'mixc4*',
      amountOfParticipants: 2,
      message:
        'There are an incorrect number of participants for C4*. Participants: 2. Helm: false',
    },
    {
      code: 'mix2x',
      amountOfParticipants: 1,
      message:
        'There are an incorrect number of participants for 2x. Participants: 1. Helm: false',
    },
    {
      code: 'mix4*',
      amountOfParticipants: 2,
      message:
        'There are an incorrect number of participants for 4*. Participants: 2. Helm: false',
    },
    {
      code: 'mix4+',
      amountOfParticipants: 2,
      message:
        'There are an incorrect number of participants for 4+. Participants: 2. Helm: false',
    },
    {
      code: 'mix8+',
      amountOfParticipants: 2,
      message:
        'There are an incorrect number of participants for 8+. Participants: 2. Helm: false',
    },
    {
      code: 'mix8*',
      amountOfParticipants: 2,
      message:
        'There are an incorrect number of participants for 8*. Participants: 2. Helm: false',
    },
  ])(
    'throws an error because of wrong boattype',
    ({ code, amountOfParticipants, message }) => {
      const record = {
        ...BASIC_CSV_RECORD,
        [TEAM_COMPETITION_CODE]: code,
        ...getParticipantsBasedOnAmount(amountOfParticipants),
      };
      mockPipe.mockReturnValue([record]);

      return expect(
        bondService.readBondFile({
          pipe: mockPipe,
        } as unknown as Stream)
      ).rejects.toThrow(message);
    }
  );

  it.each([
    {
      name: 'boatname',
      record: { ...CSV_RECORD, [BOAT_NAME]: undefined },
      message: 'Er is geen bootnaam ingevuld',
    },
    {
      name: 'teamclub',
      record: { ...CSV_RECORD, [TEAM_CLUB]: undefined },
      message: 'Er is geen verenigingsnaam ingevuld',
    },
    {
      name: 'wedstrijdcode',
      record: { ...CSV_RECORD, [TEAM_COMPETITION_CODE]: undefined },
      message: 'Er is geen wedstrijdcode ingevuld',
    },
  ])('throws an error because of missing $name', ({ record, message }) => {
    mockPipe.mockReturnValue([record]);

    return expect(
      bondService.readBondFile({
        pipe: mockPipe,
      } as unknown as Stream)
    ).rejects.toThrow(message);
  });

  it('returns a boat without boatname', async () => {
    mockPipe.mockReturnValue([{ ...CSV_RECORD, [BOAT_NAME]: '-' }]);
    const { teams } = await bondService.readBondFile({
      pipe: mockPipe,
    } as unknown as Stream);

    expect(teams).toHaveLength(1);
    expect(teams[0].boat).toEqual(null);
  });
});

function getParticipantsBasedOnAmount(amount: number) {
  const slag: Record<string, string> = {
    Slag: 'slag',
    'NKODE Slag': 'nkode Slag',
    'geb Slag': '1900',
    'VKODE Slag': 'vkode Slag',
  };
  if (amount === 1) return slag;

  const record = { ...slag };

  for (let i = 1; i < amount; i++) {
    record[`NKODE ${i + 1}`] = `nkode ${i + 1}`;
    record[`VKODE ${i + 1}`] = `vkode ${i + 1}`;
    record[`geb ${i + 1}`] = `geb ${i + 1}`;
    record[`${i + 1}`] = `${i + 1}`;
  }

  if (amount === 2) return record;

  if (amount === 8) {
    record[`NKODE Boeg`] = `nkode Boeg`;
    record[`VKODE Boeg`] = `vkode Boeg`;
    record[`geb Boeg`] = `geb Boeg`;
    record[`Boeg`] = 'boeg';
  }

  return {
    ...record,
    [HELM]: HELM,
    [`NKODE ${HELM}`]: `nkode ${HELM}`,
    [`VKODE ${HELM}`]: `vkode ${HELM}`,
    [`geb ${HELM}`]: '1900',
  };
}
