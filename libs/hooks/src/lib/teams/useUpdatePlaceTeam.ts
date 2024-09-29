'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UpdatePlaceArgs } from '@models';

export function useUpdatePlaceTeam() {
  const queryClient = useQueryClient();

  return useMutation(
    ['update-place-team'],
    async (args: UpdatePlaceArgs) => {
      console.log('updating place', args);
      const response = await fetch('api/teams/update-place', {
        method: 'POST',
        body: JSON.stringify(args),
      });

      if (!response.ok) throw new Error('Could not update the place of teams');

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['get-teams'] }),
    }
  );
}
