import {
  ageTypes,
  boatTypes,
  ClassItem,
  genders,
  Team,
  translateClass,
  UseUpdateStartNumberTeam,
  UseUpdateStartNumberTeamArgs,
} from '@models';
import { getClassMap } from '@utils';
import { Item } from '@components/server';

interface GetTeamsForStartNumbersProps {
  teams?: Team[];
  classes: ClassItem[];
  missingNumbers: number[];
  saveData: (val: UseUpdateStartNumberTeamArgs) => void;
  isJeugdWedstrijd: boolean;
}

export function getTeamsForStartNumbers({
  teams,
  classes,
  missingNumbers,
  saveData,
  isJeugdWedstrijd,
}: GetTeamsForStartNumbersProps) {
  const rows: Item[][] = [];
  if (!teams) return rows;
  const missingNumbersSet = new Set<number>(missingNumbers);

  const classMap = getClassMap(classes);
  const toBeSaved: UseUpdateStartNumberTeam[] = [];

  teams.sort((a, b) => {
    let sortBlock;
    if (!a.block || !b.block) {
      sortBlock = 0;
    } else {
      sortBlock = a.block < b.block ? -1 : a.block > b.block ? 1 : 0;
    }

    return (
      sortBlock ||
      boatTypes.indexOf(a.boatType) - boatTypes.indexOf(b.boatType) ||
      genders.indexOf(a.gender) - genders.indexOf(b.gender) ||
      ageTypes.indexOf(a.ageClass) - ageTypes.indexOf(b.ageClass)
    );
  });

  let startNr = 1;
  let boatAndGenderBlock: Team[] = [];
  teams.forEach((team) => {
    if (
      boatAndGenderBlock.length === 0 ||
      (boatAndGenderBlock[0].boatType === team.boatType &&
        boatAndGenderBlock[0].gender === team.gender)
    ) {
      boatAndGenderBlock.push(team);
    } else {
      const { sortedRows, startNumber } = getSortedRowItems({
        teams: boatAndGenderBlock,
        initialStartNumber: startNr,
        classMap,
        missingNumbersSet,
        toBeSavedItems: toBeSaved,
        isJeugdWedstrijd,
      });
      rows.push(...sortedRows);
      startNr = startNumber;
      boatAndGenderBlock = [team];
    }
  });

  const { sortedRows } = getSortedRowItems({
    teams: boatAndGenderBlock,
    initialStartNumber: startNr,
    classMap,
    missingNumbersSet,
    isLastOne: true,
    toBeSavedItems: toBeSaved,
    isJeugdWedstrijd,
  });

  rows.push(...sortedRows);
  saveData({ teams: toBeSaved });

  return rows;
}

interface SortTeamsWithStartNumberProps {
  teams?: Team[];
  classes: ClassItem[];
  missingNumbers: number[];
  isJeugdWedstrijd: boolean;
}

export function sortTeamsWithStartNumber({
  teams,
  classes,
  missingNumbers,
  isJeugdWedstrijd,
}: SortTeamsWithStartNumberProps) {
  if (!teams || teams.length === 0) return [];

  const missingNumbersSet = new Set<number>(missingNumbers);

  const sortedTeams = teams.sort((a, b) => {
    if (a.startNumber === undefined || b.startNumber === undefined) {
      return 0;
    }
    return a.startNumber < b.startNumber
      ? -1
      : a.startNumber > b.startNumber
      ? 1
      : 0;
  });
  const classMap = getClassMap(classes);

  return sortedTeams.reduce((acc, team, index) => {
    if (index > 0) {
      const possibleEmptyRow = getPossibleEmptyRow(
        sortedTeams,
        index,
        missingNumbersSet
      );
      if (possibleEmptyRow) {
        acc.push(possibleEmptyRow);
      }
    }

    const classKey = `${team.ageClass}${team.gender}${team.boatType}`;
    const className = classMap.get(classKey) ?? '';
    const teamItems = [
      { node: team.startNumber?.toString() ?? '' },
      { node: team.block?.toString() ?? '' },
      {
        node: translateClass({
          gender: team.gender,
          boatType: team.boatType,
          className,
          isJeugdWedstrijd,
        }),
      },
      { node: team.name },
      { node: team.participants[0].name ?? '' },
      { node: team.boat?.name ?? '' },
    ];
    acc.push(teamItems);

    return acc;
  }, [] as Item[][]);
}

function getPossibleEmptyRow(
  teams: Team[],
  index: number,
  missingNumbers: Set<number>
) {
  const previousTeam = teams[index - 1];
  const currentTeam = teams[index];
  if (
    previousTeam.gender !== currentTeam.gender ||
    previousTeam.boatType !== currentTeam.boatType
  ) {
    let startNumber = (previousTeam.startNumber ?? 0) + 1;
    startNumber = getStartNr(startNumber, missingNumbers);
    return [
      { node: startNumber },
      { node: '' },
      { node: '' },
      { node: '' },
      { node: '' },
      { node: '' },
    ];
  }
  return undefined;
}

function getStartNr(startNr: number, missingNumbersSet: Set<number>) {
  while (missingNumbersSet.has(startNr)) {
    startNr++;
  }
  return startNr;
}

interface GetSortedRowItemsProps {
  teams: Team[];
  initialStartNumber: number;
  classMap: Map<string, string>;
  missingNumbersSet: Set<number>;
  isLastOne?: boolean;
  toBeSavedItems: UseUpdateStartNumberTeam[];
  isJeugdWedstrijd: boolean;
}

function getSortedRowItems({
  teams,
  initialStartNumber,
  classMap,
  missingNumbersSet,
  isLastOne,
  toBeSavedItems,
  isJeugdWedstrijd,
}: GetSortedRowItemsProps) {
  let startNumber = initialStartNumber;
  const sortedTeams = teams.sort((a, b) => a.place - b.place);
  const rows = sortedTeams.reduce((acc, team) => {
    const classKey = `${team.ageClass}${team.gender}${team.boatType}`;
    const className = classMap.get(classKey) ?? '';
    const teamItems = [
      { node: startNumber.toString() },
      { node: team.block?.toString() ?? '' },
      {
        node: translateClass({
          gender: team.gender,
          boatType: team.boatType,
          className,
          isJeugdWedstrijd,
        }),
      },
      { node: team.name },
      { node: team.participants[0].name ?? '' },
      { node: team.boat?.name ?? '' },
    ];
    acc.push(teamItems);
    toBeSavedItems.push({ id: team.id, startNumber });
    startNumber = getStartNr(startNumber + 1, missingNumbersSet);
    return acc;
  }, [] as Item[][]);

  if (!isLastOne) {
    rows.push([
      { node: startNumber },
      { node: '' },
      { node: '' },
      { node: '' },
      { node: '' },
      { node: '' },
    ]);
    startNumber = getStartNr(startNumber + 1, missingNumbersSet);
  }

  return { sortedRows: rows, startNumber };
}
