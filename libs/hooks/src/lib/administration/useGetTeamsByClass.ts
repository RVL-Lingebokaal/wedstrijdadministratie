import { useMemo } from 'react';
import { AgeItem, AgeType, getAgeClassTeam, Team } from '@models';

export function useGetTeamsByClass(teams: Team[], ages: AgeItem[]) {
  return useMemo(() => {
    return teams.reduce((acc, team) => {
      const ageClass = getAgeClassTeam({
        ages,
        participants: team.participants,
      });
      let teams: Team[] = [];
      if (acc.has(ageClass)) {
        teams = acc.get(ageClass) ?? [];
      }
      teams.push(team);
      return acc.set(ageClass, teams);
    }, new Map<AgeType, Team[]>());
  }, [teams, ages]);
}
