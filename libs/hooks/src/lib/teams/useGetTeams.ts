'use client';
import { useQuery } from '@tanstack/react-query';
import { Team } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useGetTeams(wedstrijdId: string) {
  return useQuery(
    ['get-teams'],
    async () => {
      const response = await fetch(
        `/api/teams/all?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        { method: 'GET' }
      );

      if (!response.ok) throw new Error('Could not get teams');

      const result = (await response.json()) as any[];

      return result.map<Team>((team) => {
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
          block: parseInt(team.block ?? team.preferredBlock),
        };
      });
    },
    {
      keepPreviousData: true,
    }
  );
}
