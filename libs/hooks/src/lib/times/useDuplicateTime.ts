import { useMutation } from '@tanstack/react-query';
import { Time } from '@models';

interface UseDuplicateTimeProps extends Omit<Time, 'id'> {
  isA: boolean;
  isStart: boolean;
}

export function useDuplicateTime(onSuccessFunc?: (time: Time) => void) {
  return useMutation(
    ['restore-time'],
    async (args: UseDuplicateTimeProps) => {
      const response = await fetch('/api/teams/time', {
        method: 'POST',
        body: JSON.stringify({ ...args, type: 'duplicate' }),
      });

      if (!response.ok) throw new Error('Could not save the time');

      return { id: await response.json(), time: args.time };
    },
    {
      onSuccess: (data) => onSuccessFunc?.(data),
    }
  );
}
