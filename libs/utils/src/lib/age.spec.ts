import { allAgesAreProcessed, calculateAgeType, getClassMap } from './age';
import { AgeType, BoatType, Gender, Participant } from '@models';
import { GetTeamResult } from '@hooks';
import { allAges, classItems, teams } from '../tests/mocks';

describe('age', () => {
  describe(calculateAgeType.name, () => {
    it.each([
      { ageToBeFound: 13, expected: AgeType.fourteen },
      { ageToBeFound: 16, expected: AgeType.sixteen },
      { ageToBeFound: 18, expected: AgeType.eighteen },
      { ageToBeFound: 26, expected: AgeType.open },
      { ageToBeFound: 35, expected: AgeType.VA },
      { ageToBeFound: 42, expected: AgeType.VB },
      { ageToBeFound: 49, expected: AgeType.VC },
      { ageToBeFound: 54, expected: AgeType.VD },
      { ageToBeFound: 59, expected: AgeType.VE },
      { ageToBeFound: 64, expected: AgeType.VF },
      { ageToBeFound: 69, expected: AgeType.VG },
      { ageToBeFound: 74, expected: AgeType.VH },
      { ageToBeFound: 79, expected: AgeType.VI },
      { ageToBeFound: 84, expected: AgeType.VJ },
      { ageToBeFound: 120, expected: AgeType.VK },
      { ageToBeFound: 60.25, expected: AgeType.VF },
      { ageToBeFound: 59.75, expected: AgeType.VE },
    ])(
      'should return the correct age for age $ageToBeFound',
      ({ ageToBeFound, expected }) => {
        const result = calculateAgeType(allAges, ageToBeFound);

        expect(result).toEqual(expected);
      }
    );

    it('should return open as default', () => {
      const result = calculateAgeType([], 85);

      expect(result).toEqual(AgeType.open);
    });
  });

  describe(allAgesAreProcessed.name, () => {
    it('returns true when all ages are processed', () => {
      const { processed, missing } = allAgesAreProcessed(
        allAges,
        teams,
        classItems
      );

      expect(processed).toEqual(true);
      expect(missing).toEqual(0);
    });

    it('returns false when not all ages are processed', () => {
      const team = {
        participants: [
          {
            birthYear: new Date().getFullYear() - 13,
            ageType: AgeType.fourteen,
          },
        ] as Participant[],
        gender: Gender.F,
        boatType: BoatType.skiff,
      } as GetTeamResult;
      const { processed, missing } = allAgesAreProcessed(
        allAges,
        [...teams, team],
        classItems
      );

      expect(processed).toEqual(false);
      expect(missing).toEqual(1);
    });
  });

  describe(getClassMap.name, () => {
    const result = getClassMap(classItems);

    expect(result.size).toEqual(9);
  });
});
