'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UpdatePlaceArgs, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useUpdatePlaceTeam({ wedstrijdId }: WedstrijdIdProps) {
  const queryClient = useQueryClient();

  return useMutation(
    ['update-place-team'],
    async (args: UpdatePlaceArgs) => {
      const response = await fetch(
        `/api/teams/update-place?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'POST',
          body: JSON.stringify(args),
        }
      );

      if (!response.ok) throw new Error('Could not update the place of teams');

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['get-teams'] }),
    }
  );
}
