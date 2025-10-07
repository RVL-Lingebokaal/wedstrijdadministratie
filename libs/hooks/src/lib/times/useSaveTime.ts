'use client';
import { useMutation } from '@tanstack/react-query';
import { SaveStartNumberTime, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useSaveTime({ wedstrijdId }: WedstrijdIdProps) {
  return useMutation(['save-time'], async (args: SaveStartNumberTime) => {
    const response = await fetch(
      `/api/teams/time/koppel?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
      {
        method: 'POST',
        body: JSON.stringify(args),
      }
    );

    if (!response.ok) throw new Error('Could not save the time');

    return { success: true };
  });
}
