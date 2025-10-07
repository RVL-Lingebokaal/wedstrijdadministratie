'use client';
import { useMutation } from '@tanstack/react-query';
import { Time, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useDeleteTime({ wedstrijdId }: WedstrijdIdProps) {
  return useMutation(['delete-time'], async (args: Time) => {
    const response = await fetch(
      `/api/teams/time?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
      {
        method: 'POST',
        body: JSON.stringify({ ...args, type: 'delete' }),
      }
    );

    if (!response.ok) throw new Error('Could not save the time');

    return { success: true };
  });
}
