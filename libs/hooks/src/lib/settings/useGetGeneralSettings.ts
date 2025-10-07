'use client';
import { useQuery } from '@tanstack/react-query';
import { SettingData } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useGetGeneralSettings(wedstrijdId: string) {
  return useQuery(
    ['retrieve-general-settings'],
    async () => {
      const response = await fetch(
        `/api/wedstrijd/settings?${QUERY_PARAMS.type}=general&${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) throw new Error('Could not get settings');

      return (await response.json()) as SettingData;
    },
    { keepPreviousData: false }
  );
}
