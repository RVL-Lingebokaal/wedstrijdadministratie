import {
  AgeItem,
  ageTypes,
  BoatItem,
  boatTypes,
  ClassItem,
  genders,
  translateClass,
} from '@models';
import { DateTime, Duration } from 'luxon';
import { GetTeamResult } from '@hooks';
import { getClassMap } from './age';
import { ReactNode } from 'react';

export interface Item {
  node: string | ReactNode;
  isInput?: boolean;
}

export function convertTimeToObject(time?: string) {
  if (!time) {
    return {
      dateTime: undefined,
      localeString: '',
    };
  }

  const dateTime = DateTime.fromMillis(Number.parseInt(time));
  const localeString = dateTime.toISOTime({
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
  ages: AgeItem[],
  boatItems: BoatItem[],
  results?: GetTeamResult[]
) {
  if (!results) {
    return {
      rowsMap: new Map<string, Item[][]>(),
      headers: [],
      correctedRows: [[]],
    };
  }
  const classMap = getClassMap(classItems);
  const correctionAgeSexMap = getCorrectionAgeSexMap(ages);
  const correctionBoatMap = getCorrectionBoatMap(boatItems);
  const doneSet = new Map<string, string>();
  const headers: string[] = [];

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
    ({ name, result, gender, boatType, ageClass, startNr, slag, block }) => {
      const key = `${ageClass}${gender}${boatType}`;
      const className = classMap.get(key) ?? '';
      const translatedClassName = doneSet.get(className) ?? '';
      const rows = rowsMap.get(translatedClassName) ?? [];

      const startTimeMillis = result?.startTimeA ?? result?.startTimeB;
      const finishTimeMillis = result?.finishTimeA ?? result?.finishTimeB;
      const start = convertTimeToObject(startTimeMillis);
      const finish = convertTimeToObject(finishTimeMillis);
      let correction = null;

      if (startTimeMillis && finishTimeMillis) {
        const difference =
          Number.parseInt(finishTimeMillis) - Number.parseInt(startTimeMillis);
        const correctionAgeSex =
          correctionAgeSexMap.get(`${ageClass}${gender}`) ?? 0;
        const correctionBoat = correctionBoatMap.get(boatType) ?? 0;
        const totalCorrection = correctionAgeSex * correctionBoat;

        correction = difference * totalCorrection;
      }

      const row = [
        { node: startNr },
        { node: name },
        { node: slag.name },
        {
          node:
            start.dateTime && finish.dateTime
              ? getDifference(start.dateTime, finish.dateTime)
              : '-',
        },
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
        {
          node:
            start.dateTime && finish.dateTime
              ? getDifference(start.dateTime, finish.dateTime)
              : '-',
        },
        {
          node: correction
            ? Duration.fromMillis(correction).toFormat("hh:mm:ss.SSS'")
            : '',
        },
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
    return sortTimes(a[4].node as string, b[4].node as string);
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
