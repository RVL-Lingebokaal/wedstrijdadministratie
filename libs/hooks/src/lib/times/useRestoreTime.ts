import { useMutation } from '@tanstack/react-query';
import { Time, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

interface UseRestoreTimeProps extends Time {
  teamId: string;
  isA: boolean;
  isStart: boolean;
}

export function useRestoreTime({ wedstrijdId }: WedstrijdIdProps) {
  return useMutation(['restore-time'], async (args: UseRestoreTimeProps) => {
    const response = await fetch(
      `/api/teams/time?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
      {
        method: 'POST',
        body: JSON.stringify({ ...args, type: 'restore' }),
      }
    );

    if (!response.ok) throw new Error('Could not save the time');

    return { success: true };
  });
}
