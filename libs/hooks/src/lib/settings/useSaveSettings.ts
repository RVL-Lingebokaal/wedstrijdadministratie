'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_PARAMS } from '@utils';
import { SaveSettingsSchema, WedstrijdIdProps } from '@models';

interface UseSaveSettingsProps extends WedstrijdIdProps {
  onSuccess: () => void;
}

export function useSaveSettings({
  onSuccess,
  wedstrijdId,
}: UseSaveSettingsProps) {
  const queryClient = useQueryClient();

  return useMutation(
    ['save-settings'],
    async (args: SaveSettingsSchema) => {
      const response = await fetch(
        `/api/wedstrijd/settings?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'POST',
          body: JSON.stringify(args),
        }
      );

      if (!response.ok) throw new Error('Could not save settings');

      return { success: true };
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['retrieve-settings'],
        });
        onSuccess();
      },
    }
  );
}
