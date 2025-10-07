'use client';
import { useQuery } from '@tanstack/react-query';
import { Settings } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useGetSettings(wedstrijdId: string) {
  return useQuery(
    ['retrieve-settings'],
    async () => {
      const response = await fetch(
        `/api/wedstrijd/settings?${QUERY_PARAMS.type}=items&${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) throw new Error('Could not get settings');

      return (await response.json()) as Omit<Settings, 'general'>;
    },
    { keepPreviousData: false }
  );
}
