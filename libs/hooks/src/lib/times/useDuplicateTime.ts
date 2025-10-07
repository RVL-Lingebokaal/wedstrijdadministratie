import { useMutation } from '@tanstack/react-query';
import { Time, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

interface UseDuplicateTimeProps extends Omit<Time, 'id'> {
  isA: boolean;
  isStart: boolean;
}

export function useDuplicateTime({ wedstrijdId }: WedstrijdIdProps) {
  return useMutation(['restore-time'], async (args: UseDuplicateTimeProps) => {
    const response = await fetch(
      `/api/teams/time?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
      {
        method: 'POST',
        body: JSON.stringify({ ...args, type: 'duplicate' }),
      }
    );

    if (!response.ok) throw new Error('Could not save the time');

    return { id: await response.json(), time: args.time };
  });
}
