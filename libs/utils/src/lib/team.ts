import { TeamResult } from '@models';
import { DateTime } from 'luxon';
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

export function getConvertedResults(results?: TeamResult[]) {
  if (!results) {
    return [];
  }

  return results.reduce<Item[][]>((acc, { name, result }) => {
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

    acc.push(row);
    return acc;
  }, []);
}
