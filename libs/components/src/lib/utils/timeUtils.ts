import {
  BoatType,
  Gender,
  getTimeKey,
  SaveStartNumberTime,
  StartNumberTime,
  Team,
  TeamTimes,
  Time,
} from '@models';
import { Dispatch, SetStateAction } from 'react';
import { convertTimeToObject } from '@utils';

export function getNewTimes(prevTimes: Time[], newTimes: Time[]) {
  let result: Time[] = [];
  if (prevTimes.length === 0) {
    result = newTimes;
  } else {
    result = [...prevTimes];
    newTimes.forEach((newTime) => {
      if (!result.some((time) => time.id === newTime.id)) {
        result.push(newTime);
      }
    });
  }
  return result.sort((a, b) => parseInt(b.time) - parseInt(a.time));
}

export function getPossibleStartNumbers(
  teams: Team[],
  isA: boolean,
  isStart: boolean
) {
  const key = getTimeKey(isA, isStart);

  return teams
    .reduce((acc, team) => {
      if (team.startNumber && !team.result?.[key])
        acc.push(`${team.startNumber.toString()} - ${team.club}`);

      return acc;
    }, [] as string[])
    .sort((a, b) => parseInt(a) - parseInt(b));
}

interface OnClickKoppelProps {
  selectedTime: Time | null;
  selected: string;
  setStartNumberTimes: Dispatch<SetStateAction<StartNumberTime[]>>;
  setTimes: Dispatch<SetStateAction<Time[]>>;
  setSelected: Dispatch<SetStateAction<string>>;
  setSelectedTime: Dispatch<SetStateAction<Time | null>>;
  teams: Team[];
  mutate: (args: SaveStartNumberTime) => void;
  isA: boolean;
  isStart: boolean;
}

export function onClickKoppel({
  selectedTime,
  selected,
  setStartNumberTimes,
  setTimes,
  setSelected,
  setSelectedTime,
  teams,
  mutate,
  isA,
  isStart,
}: OnClickKoppelProps) {
  if (!selectedTime) return;
  const splittedSelect = selected.split(' - ');
  const startNumber = parseInt(splittedSelect[0]);

  const selectedTeam = teams.find((team) => team.startNumber === startNumber);

  if (!selectedTeam) return;

  setStartNumberTimes((prevState) => {
    if (prevState.some((time) => time.id === selectedTime.id)) return prevState;
    prevState.push({
      ...selectedTime,
      startNumber,
      club: splittedSelect[1],
      teamId: selectedTeam.id,
    });
    return prevState;
  });
  setTimes((prevState) => {
    const newTimes = prevState.filter((time) => time.id !== selectedTime.id);
    setSelectedTime(newTimes[0] ?? null);
    return newTimes;
  });
  mutate({
    ...selectedTime,
    startNumber,
    club: splittedSelect[1],
    teamId: selectedTeam.id,
    isStart,
    isA,
  });

  setSelected('');
}

interface GetCorrectedTimeProps {
  result?: TeamTimes;
  correctionAgeSexMap: Map<string, number>;
  correctionBoatMap: Map<string, number>;
  ageClass: string;
  boatType: BoatType;
  gender: Gender;
}

export function getCorrectedTime({
  result,
  correctionBoatMap,
  correctionAgeSexMap,
  boatType,
  ageClass,
  gender,
}: GetCorrectedTimeProps) {
  const startTimeMillis = result?.startTimeA ?? result?.startTimeB;
  const finishTimeMillis = result?.finishTimeA ?? result?.finishTimeB;
  const start = convertTimeToObject(startTimeMillis);
  const finish = convertTimeToObject(finishTimeMillis);
  let correction = 0;

  if (startTimeMillis && finishTimeMillis) {
    const difference =
      Number.parseInt(finishTimeMillis.toString()) -
      Number.parseInt(startTimeMillis.toString());
    const correctionAgeSex =
      correctionAgeSexMap.get(`${ageClass}${gender}`) ?? 0;
    const correctionBoat = correctionBoatMap.get(boatType) ?? 0;
    const totalCorrection = correctionAgeSex * correctionBoat;

    correction = difference * totalCorrection;
  }

  return { correction, start, finish };
}

export function getDifferenceResult(times?: TeamTimes) {
  let finishDifference: null | number = null;
  let startDifference: null | number = null;

  if (!times) {
    return { finishDifference, startDifference };
  }
  const { startTimeA, startTimeB, finishTimeA, finishTimeB } = times;
  if (startTimeA && startTimeB) {
    const startDiff = startTimeB - startTimeA;
    startDifference = Math.abs(startDiff);
  }
  if (finishTimeA && finishTimeB) {
    const finishDiff = finishTimeB - finishTimeA;
    finishDifference = Math.abs(finishDiff);
  }

  return { finishDifference, startDifference };
}
