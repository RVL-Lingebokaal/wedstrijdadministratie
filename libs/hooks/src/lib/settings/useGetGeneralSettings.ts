'use client';
import { useQuery } from '@tanstack/react-query';
import { SettingData } from '@models';

export function useGetGeneralSettings() {
  return useQuery(
    ['retrieve-general-settings'],
    async () => {
      const response = await fetch('/api/settings?type=general', {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Could not get settings');

      return (await response.json()) as SettingData;
    },
    { keepPreviousData: false }
  );
}
