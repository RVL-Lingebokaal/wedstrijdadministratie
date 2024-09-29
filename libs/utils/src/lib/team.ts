import {
  AgeItem,
  AgeType,
  BoatType,
  ClassItem,
  Gender,
  getAgeClassTeam,
  translateClass,
} from '@models';
import { DateTime } from 'luxon';
import { GetTeamResult } from '@hooks';
import { getClassMap } from './age';
import { ReactNode } from 'react';

interface Item {
  node: string | ReactNode;
  isInput?: boolean;
}

function convertTimeToObject(time?: string) {
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

function getDifference(startTime: DateTime, finishTime: DateTime) {
  const diff = finishTime.diff(startTime, [
    'minutes',
    'seconds',
    'milliseconds',
  ]);
  return diff.toISOTime();
}

export function getConvertedResults(
  classItems: ClassItem[],
  ages: AgeItem[],
  results?: GetTeamResult[]
) {
  if (!results) {
    return { rowsMap: new Map<string, Item[][]>(), headers: [] };
  }
  const classMap = getClassMap(classItems);
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

  results.forEach(({ name, result, gender, boatType, participants }) => {
    const key = `${getAgeClassTeam({
      ages,
      participants,
    })}${gender}${boatType}`;
    const className = classMap.get(key) ?? '';
    const translatedClassName = doneSet.get(className) ?? '';
    const rows = rowsMap.get(translatedClassName) ?? [];

    const startTimeMillis = result?.startTimeA ?? result?.startTimeB;
    const finishTimeMillis = result?.finishTimeA ?? result?.finishTimeB;
    const start = convertTimeToObject(startTimeMillis);
    const finish = convertTimeToObject(finishTimeMillis);

    const row = [
      { node: name },
      { node: start.localeString },
      { node: finish.localeString },
      {
        node:
          start.dateTime && finish.dateTime
            ? getDifference(start.dateTime, finish.dateTime)
            : 'Nog niets beschikbaar',
      },
      { node: 'CorrectedTimeResult' },
    ];

    rows.push(row);
    rowsMap.set(translatedClassName, rows);
  });

  return { rowsMap, headers };
}
