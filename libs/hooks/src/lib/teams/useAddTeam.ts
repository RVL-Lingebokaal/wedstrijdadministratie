'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamAddForm } from '@schemas';
import { WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useAddTeam({ wedstrijdId }: WedstrijdIdProps) {
  const queryClient = useQueryClient();

  return useMutation(
    ['save-team'],
    async (args: TeamAddForm) => {
      const response = await fetch(
        `/api/teams/create?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'POST',
          body: JSON.stringify(args),
        }
      );

      if (!response.ok) throw new Error('Could not save the team');

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['get-teams'] }),
    }
  );
}
