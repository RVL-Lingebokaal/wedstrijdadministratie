'use client';
import { BoatType, Gender, Team } from '@models';
import { useMemo } from 'react';

export function useGetGroups(teams: Team[], gender: Gender) {
  return useMemo(() => {
    return teams.reduce((acc, team) => {
      const boatType = team.boatType;
      if (!boatType) {
        throw new Error('missing boattype in boat');
      }
      if (team.gender !== gender) {
        return acc;
      }
      let teams: Team[] = [];
      if (acc.has(boatType)) {
        teams = acc.get(boatType) ?? [];
      }
      teams.push(team);
      return acc.set(boatType, teams);
    }, new Map<BoatType, Team[]>());
  }, [teams, gender]);
}
