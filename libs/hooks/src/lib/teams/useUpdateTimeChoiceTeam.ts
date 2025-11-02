'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostResultsForTeamDto, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useUpdateTimeChoice({ wedstrijdId }: WedstrijdIdProps) {
  const queryClient = useQueryClient();

  return useMutation(
    ['update-team-time-choice'],
    async (args: PostResultsForTeamDto) => {
      const response = await fetch(
        `/api/teams/results?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'POST',
          body: JSON.stringify(args),
        }
      );
      if (!response.ok)
        throw new Error('Could not save the time choice for this team');

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['get-teams'] }),
    }
  );
}
