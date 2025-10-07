'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamAddForm } from '@schemas';
import { WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

export interface UpdateTeamArgs extends TeamAddForm {
  teamId: string;
}
export function useUpdateTeam({ wedstrijdId }: WedstrijdIdProps) {
  const queryClient = useQueryClient();

  return useMutation(
    ['update-team'],
    async (args: UpdateTeamArgs) => {
      const response = await fetch(
        `api/teams/update?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'POST',
          body: JSON.stringify(args),
        }
      );

      if (!response.ok) throw new Error('Could not update the team');

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['get-teams'] }),
    }
  );
}
