import { useMemo } from "react";
import { Gender, Team } from "../models/team";
import { AgeItem, BoatType } from "../models/settings";

interface UseGetSessionTotalsProps {
  ageItems: AgeItem[];
  teams?: Team[];
  sortArrayBoatTypes?: BoatType[];
}

const genderArray = [Gender.M, Gender.MIX, Gender.F];

export function useGetSessionTotals({
  ageItems,
  sortArrayBoatTypes,
  teams,
}: UseGetSessionTotalsProps) {
  return useMemo(() => {
    const basicMap = new Map<number, Map<BoatType, Team[]>>();
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
      const teamBoatType = team.getBoatType();
      if (!teamBoatType) {
        return acc;
      }

      boatSet.add(teamBoatType);
      const blockId = team.getBlock();

      let totalBlock = blocksMap.get(blockId);
      blocksMap.set(blockId, totalBlock ? ++totalBlock : 1);

      const boatTypes = acc.get(blockId);
      if (!boatTypes) {
        const types = new Map<BoatType, Team[]>();
        types.set(teamBoatType, [team]);
        return acc.set(blockId, types);
      }

      let teams = boatTypes.get(teamBoatType);
      if (!teams) {
        teams = [];
      }
      teams.push(team);
      //First sort on age class
      teams.sort((ta, tb) =>
        ta.getAgeClass(ageItems).localeCompare(tb.getAgeClass(ageItems))
      );
      //Secondly, sort on place
      teams.sort((ta, tb) => ta.getPlace() - tb.getPlace());
      //Thirdly, sort on gender
      teams.sort((ta, tb) => {
        const genderA = ta.getGender();
        const genderB = tb.getGender();
        if (!genderA) return 0;
        if (!genderB) return 1;

        return genderArray.indexOf(genderA) - genderArray.indexOf(genderB);
      });

      //Lastly, sort on given sort order
      if (sortArrayBoatTypes) {
        teams.sort((ta, tb) => {
          const boatTypeA = ta.getBoatType();
          const boatTypeB = tb.getBoatType();
          if (!boatTypeA) return 0;
          if (!boatTypeB) return 1;
          return (
            sortArrayBoatTypes.indexOf(boatTypeA) -
            sortArrayBoatTypes.indexOf(boatTypeB)
          );
        });
      }

      boatTypes.set(teamBoatType, teams);
      return acc.set(blockId, boatTypes);
    }, basicMap);

    return { blockTeams: basicMap, totalBlocks: blocksMap, boatTypes: boatSet };
  }, [ageItems, sortArrayBoatTypes, teams]);
}
