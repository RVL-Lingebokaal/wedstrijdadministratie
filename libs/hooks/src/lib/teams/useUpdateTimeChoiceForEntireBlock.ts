'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostResultsForChangeEntireBlockDto, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';
import toast from 'react-hot-toast';

export function useUpdateTimeChoiceForEntireBlock({
  wedstrijdId,
}: WedstrijdIdProps) {
  const queryClient = useQueryClient();

  return useMutation(
    ['update-team-time-choice-entire-block'],
    async (args: PostResultsForChangeEntireBlockDto) => {
      const response = await fetch(
        `/api/teams/time/choice/block?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
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
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['get-teams'] });
        await queryClient.invalidateQueries({
          queryKey: ['get-results-teams'],
        });
        toast.success('De wijzigingen voor de tijd keuze zijn opgeslagen');
      },
    }
  );
}
