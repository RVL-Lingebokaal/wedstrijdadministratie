'use client';
import { useMemo } from 'react';
import { AgeItem, AgeType, Team } from '@models';

export function useGetTeamsByClass(teams: Team[], ages: AgeItem[]) {
  return useMemo(() => {
    return teams.reduce((acc, team) => {
      let teams: Team[] = [];
      if (acc.has(team.ageClass)) {
        teams = acc.get(team.ageClass) ?? [];
      }
      teams.push(team);
      return acc.set(team.ageClass, teams);
    }, new Map<AgeType, Team[]>());
  }, [teams, ages]);
}
