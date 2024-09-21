'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingData } from '@models';

export function useSaveGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation(
    ['save-general-settings'],
    async (args: SettingData) => {
      const response = await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ ...args, type: 'general' }),
      });

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
