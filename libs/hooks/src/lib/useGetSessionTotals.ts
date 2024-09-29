'use client';
import { useMemo } from 'react';
import { AgeItem, BoatType, getAgeClassTeam, Team } from '@models';

export function useGetSessionTotals(ageItems: AgeItem[], teams?: Team[]) {
  return useMemo(() => {
    const basicMap = new Map<number, Map<string, Team[]>>();
    const blocksMap = new Map<number, number>([
      [1, 0],
      [2, 0],
      [3, 0],
    ]);
    const boatSet = new Set<BoatType>();

    if (!teams || teams.length === 0) {
      return {
        blockTeams: basicMap,
        totalBlocks: blocksMap,
        boatTypes: boatSet,
      };
    }

    teams.reduce((acc, team) => {
      const teamBoatType = team.boatType;
      const teamGender = team.gender;
      if (!teamBoatType) {
        return acc;
      }

      const key = `${teamBoatType}${teamGender}`;
      boatSet.add(teamBoatType);
      const blockId = team.block ?? 0;

      let totalBlock = blocksMap.get(blockId);
      blocksMap.set(blockId, totalBlock ? ++totalBlock : 1);

      const boatTypes = acc.get(blockId);
      if (!boatTypes) {
        const types = new Map<string, Team[]>();
        types.set(key, [team]);
        return acc.set(blockId, types);
      }

      let teams = boatTypes.get(key);
      if (!teams) {
        teams = [];
      }
      teams.push(team);
      //First sort on age class
      teams.sort((ta, tb) =>
        getAgeClassTeam({
          ages: ageItems,
          participants: ta.participants,
        }).localeCompare(
          getAgeClassTeam({ ages: ageItems, participants: tb.participants })
        )
      );
      //Secondly, sort on place
      teams.sort((ta, tb) => ta.place - tb.place);

      boatTypes.set(key, teams);
      return acc.set(blockId, boatTypes);
    }, basicMap);

    return { blockTeams: basicMap, totalBlocks: blocksMap, boatTypes: boatSet };
  }, [ageItems, teams]);
}
