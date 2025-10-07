'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UpdateBlockArgs, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

interface UseUpdateBlockTeamProps extends WedstrijdIdProps {
  onError: () => void;
}

export function useUpdateBlockTeam({
  onError,
  wedstrijdId,
}: UseUpdateBlockTeamProps) {
  const queryClient = useQueryClient();

  return useMutation(
    ['update-block-team'],
    async (args: UpdateBlockArgs) => {
      const response = await fetch(
        `/api/teams/update-block?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'POST',
          body: JSON.stringify(args),
        }
      );

      const result = (await response.json()) as any;

      if (result.errorMessage) {
        return Promise.reject(result.errorMessage);
      }

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['get-teams'] }),
      onError,
    }
  );
}
