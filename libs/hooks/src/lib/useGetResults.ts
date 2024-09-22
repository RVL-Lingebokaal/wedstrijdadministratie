'use client';
import { useQuery } from '@tanstack/react-query';
import { BoatType, Gender, Participant, TeamResult } from '@models';

export interface GetTeamResult extends TeamResult {
  boatType: BoatType;
  participants: Participant[];
  gender: Gender;
}

export function useGetResults() {
  return useQuery(
    ['get-results'],
    async () => {
      const response = await fetch('/api/results', { method: 'GET' });

      if (!response.ok) throw new Error('Could not get results');

      return (await response.json()) as GetTeamResult[];
    },
    {
      keepPreviousData: true,
    }
  );
}
