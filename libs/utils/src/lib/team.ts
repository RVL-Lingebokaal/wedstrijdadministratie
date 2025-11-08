import {
  AgeItem,
  ageTypes,
  BoatItem,
  boatTypes,
  ClassItem,
  genders,
  GetResultsForTeamsResponseDto,
  TeamTimes,
  translateClass,
} from '@models';
import { DateTime } from 'luxon';
import { getClassMap } from './age';
import { ReactNode } from 'react';

export interface Item {
  node: string | ReactNode;
  isInput?: boolean;
}

export function getTimeFromResult(times?: TeamTimes) {
  if (!times) {
    return { finishTimeMillis: undefined, startTimeMillis: undefined };
  }
  const {
    startTimeB,
    startTimeA,
    finishTimeB,
    finishTimeA,
    useFinishA,
    useStartA,
  } = times;
  const startTimeMillis =
    useStartA && startTimeA
      ? startTimeA
      : useStartA === false && startTimeB
      ? startTimeB
      : startTimeA ?? startTimeB;
  const finishTimeMillis =
    useFinishA && finishTimeA
      ? finishTimeA
      : useFinishA === false && finishTimeB
      ? finishTimeB
      : finishTimeA ?? finishTimeB;
  return { finishTimeMillis, startTimeMillis };
}

export function convertTimeToObject(time?: number | null) {
  if (!time) {
    return {
      dateTime: undefined,
      localeString: null,
    };
  }

  const dateTime = DateTime.fromMillis(time);
  const localeString = dateTime.toISOTime({
    includeOffset: false,
  });
  return {
    dateTime,
    localeString,
  };
}

export function convertTimeToObjectDifference(time?: number | null) {
  if (!time) {
    return {
      dateTime: undefined,
      localeString: null,
    };
  }

  const dateTime = DateTime.fromMillis(time);
  const localeString = dateTime.toUTC().toISOTime({
    includeOffset: false,
  });
  return {
    dateTime,
    localeString,
  };
}

export function getDifference(startTime: DateTime, finishTime: DateTime) {
  const diff = finishTime.diff(startTime, [
    'minutes',
    'seconds',
    'milliseconds',
  ]);
  return diff.toISOTime();
}

export function getCorrectionAgeSexMap(ages: AgeItem[]) {
  return ages.reduce((map, { type, correctionFemale, correctionMale }) => {
    map.set(`${type}male`, correctionMale);
    map.set(`${type}female`, correctionFemale);
    map.set(`${type}mix`, (correctionFemale + correctionMale) / 2);
    return map;
  }, new Map<string, number>());
}

export function getCorrectionBoatMap(boatItems: BoatItem[]) {
  return boatItems.reduce(
    (map, { type, correction }) => map.set(type, correction),
    new Map<string, number>()
  );
}

export function getConvertedResults(
  classItems: ClassItem[],
  results: GetResultsForTeamsResponseDto['teamsResult'],
  isJeugdWedstrijd = false
) {
  if (!results) {
    return {
      rowsMap: new Map<string, Item[][]>(),
      headers: [],
      correctedRows: [[]],
    };
  }
  const classMap = getClassMap(classItems);
  const headers: string[] = [];
  const doneSet = new Map<string, string>();

  boatTypes.forEach((boatType) => {
    ageTypes.forEach((age) => {
      genders.forEach((g) => {
        const key = `${age}${g}${boatType}`;
        const className = classMap.get(key);
        if (className && !doneSet.has(className)) {
          const translatedClass = translateClass({
            gender: g,
            boatType,
            className,
            isJeugdWedstrijd,
          });
          doneSet.set(className, translatedClass);
          headers.push(translatedClass);
        }
      });
    });
  });

  const rowsMap = new Map<string, Item[][]>();
  const correctedRows = [] as Item[][];

  results.forEach(
    ({
      name,
      correction,
      difference,
      className,
      ageClass,
      startNr,
      slag,
      block,
    }) => {
      const translatedClassName = doneSet.get(className) ?? '';
      const rows = rowsMap.get(translatedClassName) ?? [];

      const row = [
        { node: startNr },
        { node: name },
        { node: slag },
        { node: difference ?? '-' },
        { node: ageClass },
        { node: block },
      ];

      rows.push(row);
      rowsMap.set(translatedClassName, rows);
      correctedRows.push([
        { node: startNr },
        { node: className },
        { node: name },
        { node: ageClass },
        { node: difference ?? '-' },
        { node: correction ?? '-' },
      ]);
    }
  );
  [...rowsMap.keys()].forEach((key) => {
    const rows = rowsMap.get(key) ?? [];
    const sortedRows = rows.sort((a, b) => {
      return sortTimes(a[3].node as string, b[3].node as string);
    });
    rowsMap.set(key, sortedRows);
  });
  const sortedCorrectedRows = correctedRows.sort((a, b) => {
    return sortTimes(a[5].node as string, b[5].node as string);
  });
  return { rowsMap, headers, correctedRows: sortedCorrectedRows };
}

function sortTimes(a: string, b: string) {
  if (a && b && a !== '-' && b !== '-') {
    return DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis();
  }
  if (a === '-') {
    return 1;
  }
  return -1;
}
