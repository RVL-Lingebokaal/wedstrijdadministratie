import {
  convertTimeToObject,
  getConvertedResults,
  getDifference,
  Item,
} from './team';
import { DateTime } from 'luxon';
import { allAges, boatItems, classItems, teams } from '../tests/mocks';

describe('teams', () => {
  describe(convertTimeToObject.name, () => {
    it('returns an empty datetime object when time is undefined', () => {
      const result = convertTimeToObject(undefined);

      expect(result).toEqual({ dateTime: undefined, localeString: '' });
    });

    it('returns a datetime object when time is defined', () => {
      const isoTime = '1990-01-01T15:15:15';
      const time = DateTime.fromISO(isoTime).toMillis().toString();
      const result = convertTimeToObject(time);

      expect(result.dateTime).toEqual(DateTime.fromISO(isoTime));
      expect(result.localeString).toEqual('15:15:15.000');
    });
  });

  describe(getDifference.name, () => {
    it('returns the difference between two times', () => {
      const startTime = DateTime.fromISO('1990-01-01T15:15:15');
      const finishTime = DateTime.fromISO('1990-01-01T15:15:20');
      const result = getDifference(startTime, finishTime);

      expect(result).toEqual('00:00:05.000');
    });
  });

  describe(getConvertedResults.name, () => {
    it('retrieves an empty object when results are undefined', () => {
      const result = getConvertedResults([], [], []);

      expect(result).toEqual({
        rowsMap: new Map<string, Item[][]>(),
        headers: [],
      });
    });

    it('retrieves a result object', () => {
      const result = getConvertedResults(classItems, allAges, boatItems, teams);

      expect(result.headers).toEqual([
        'Mix4-Mix 4*',
        'D2-Dames dub',
        'H1xHeren skiff',
      ]);
      expect(result.rowsMap.size).toEqual(3);
      expect(result.rowsMap.get('H1xHeren skiff')?.[0][1].node).toEqual(
        '10:00:00.000'
      );
      expect(result.rowsMap.get('H1xHeren skiff')?.[0][2].node).toEqual(
        '11:00:02.000'
      );
      expect(result.rowsMap.get('H1xHeren skiff')?.[0][3].node).toEqual(
        '01:00:02.000'
      );
      expect(result.rowsMap.get('H1xHeren skiff')?.[0][4].node).toEqual(
        '00:53:43.790'
      );
      expect(result.rowsMap.get('D2-Dames dub')?.[0][1].node).toEqual(
        '10:00:09.000'
      );
      expect(result.rowsMap.get('D2-Dames dub')?.[0][2].node).toEqual(
        '11:00:03.000'
      );
      expect(result.rowsMap.get('D2-Dames dub')?.[0][3].node).toEqual(
        '00:59:54.000'
      );
      expect(result.rowsMap.get('D2-Dames dub')?.[0][4].node).toEqual(
        '00:54:12.458'
      );
      expect(result.rowsMap.get('Mix4-Mix 4*')?.[0][1].node).toEqual(
        '10:00:58.000'
      );
      expect(result.rowsMap.get('Mix4-Mix 4*')?.[0][2].node).toEqual(
        '11:00:36.000'
      );
      expect(result.rowsMap.get('Mix4-Mix 4*')?.[0][3].node).toEqual(
        '00:59:38.000'
      );
      expect(result.rowsMap.get('Mix4-Mix 4*')?.[0][4].node).toEqual(
        '01:03:33.790'
      );
    });
  });
});
