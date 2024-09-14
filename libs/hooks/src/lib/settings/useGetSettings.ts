'use client';
import { useQuery } from '@tanstack/react-query';
import { Settings } from '@models';

export function useGetSettings() {
  return useQuery(
    ['retrieve-settings'],
    async () => {
      const response = await fetch('/api/settings?type=items', {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Could not get settings');

      return (await response.json()) as Settings;
    },
    { keepPreviousData: false }
  );
}
