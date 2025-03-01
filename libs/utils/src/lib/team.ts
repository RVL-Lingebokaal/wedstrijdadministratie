import {
  AgeItem,
  AgeType,
  BoatItem,
  BoatType,
  ClassItem,
  Gender,
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
    map.set(`${type}${Gender.M}`, correctionMale);
    map.set(`${type}${Gender.F}`, correctionFemale);
    map.set(`${type}${Gender.MIX}`, (correctionFemale + correctionMale) / 2);
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
    return { rowsMap: new Map<string, Item[][]>(), headers: [] };
  }
  const classMap = getClassMap(classItems);
  const correctionAgeSexMap = getCorrectionAgeSexMap(ages);
  const correctionBoatMap = getCorrectionBoatMap(boatItems);
  const doneSet = new Map<string, string>();
  const ageTypes = Object.values(AgeType);
  const genders = Object.values(Gender);
  const headers: string[] = [];

  Object.values(BoatType).forEach((boatType) => {
    ageTypes.forEach((age) => {
      genders.forEach((gender) => {
        const key = `${age}${gender}${boatType}`;
        const className = classMap.get(key);
        if (className && !doneSet.has(className)) {
          const translatedClass = translateClass({
            gender,
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

  results.forEach(({ name, result, gender, boatType, ageClass }) => {
    const key = `${ageClass}${gender}${boatType}`;
    const className = classMap.get(key) ?? '';
    const translatedClassName = doneSet.get(className) ?? '';
    const rows = rowsMap.get(translatedClassName) ?? [];

    const startTimeMillis = result?.startTimeA ?? result?.startTimeB;
    const finishTimeMillis = result?.finishTimeA ?? result?.finishTimeB;
    const start = convertTimeToObject(startTimeMillis);
    const finish = convertTimeToObject(finishTimeMillis);
    let difference = null;

    if (startTimeMillis && finishTimeMillis) {
      difference =
        Number.parseInt(finishTimeMillis) - Number.parseInt(startTimeMillis);
      const correctionAgeSex =
        correctionAgeSexMap.get(`${ageClass}${gender}`) ?? 0;
      const correctionBoat = correctionBoatMap.get(boatType) ?? 0;
      const totalCorrection = correctionAgeSex * correctionBoat;

      difference = difference * totalCorrection;
    }

    const row = [
      { node: name },
      { node: start.localeString },
      { node: finish.localeString },
      {
        node:
          start.dateTime && finish.dateTime
            ? getDifference(start.dateTime, finish.dateTime)
            : '-',
      },
      {
        node: difference
          ? Duration.fromMillis(difference).toFormat("hh:mm:ss.SSS'")
          : '',
      },
    ];

    rows.push(row);
    rowsMap.set(translatedClassName, rows);
  });

  return { rowsMap, headers };
}
