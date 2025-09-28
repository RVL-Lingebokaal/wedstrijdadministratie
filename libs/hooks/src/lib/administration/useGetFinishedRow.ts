'use client';
import { AgeItem, ClassItem, Team } from '@models';
import { useMemo } from 'react';
import { useGetTeamsByClass } from './useGetTeamsByClass';

interface UseGetFinishedRowProps {
  teams: Team[];
  classItems: ClassItem[];
  ages: AgeItem[];
}

export function useIsGetFinishedRow({
  teams,
  classItems,
  ages,
}: UseGetFinishedRowProps) {
  const teamsByClass = useGetTeamsByClass(teams, ages);

  return useMemo(() => {
    if (classItems.length === 0) return false;

    const keysAgesTeams = Array.from(teamsByClass.keys());
    const setClassItems = classItems.reduce((set, classItem) => {
      classItem.ages.forEach((age) => set.add(age));
      return set;
    }, new Set<string>());

    for (let age of keysAgesTeams) {
      if (!setClassItems.has(age)) return false;
    }
    return true;
  }, []);
}
