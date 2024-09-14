'use client';
import { useQuery } from '@tanstack/react-query';
import { TeamResult } from '@models';

export function useGetResults() {
  return useQuery(
    ['get-results'],
    async () => {
      const response = await fetch('/api/results', { method: 'GET' });

      if (!response.ok) throw new Error('Could not get results');

      return (await response.json()) as TeamResult[];
    },
    {
      keepPreviousData: true,
    }
  );
}
