'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SaveGeneralSettings, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useSaveGeneralSettings({ wedstrijdId }: WedstrijdIdProps) {
  const queryClient = useQueryClient();

  return useMutation(
    ['save-general-settings'],
    async (args: SaveGeneralSettings) => {
      const response = await fetch(
        `/api/wedstrijd/settings/general?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'POST',
          body: JSON.stringify(args),
        }
      );

      if (!response.ok) throw new Error('Could not save general settings');

      return { success: true };
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['retrieve-general-settings'],
        });
      },
    }
  );
}
