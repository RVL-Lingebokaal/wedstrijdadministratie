'use client';
import { useQuery } from '@tanstack/react-query';

export function useGetTeams() {
  return useQuery(
    ['get-teams'],
    async () => {
      const response = await fetch('/api/teams/all', { method: 'GET' });

      if (!response.ok) throw new Error('Could not get teams');

      const result = (await response.json()) as any[];
      return result.map((team) => {
        return {
          ...team,
          preferredBlock: parseInt(team.preferredBlock),
          participants: team.participants.map((p: any) => ({
            ...p,
            blocks: new Set(JSON.parse(p.blocks)),
          })),
          boat: team.boat ?? null,
          helm: team.helm
            ? {
                ...team.helm,
                blocks: new Set(JSON.parse(team.helm.blocks)),
              }
            : null,
        };
      });
    },
    {
      keepPreviousData: true,
    }
  );
}
