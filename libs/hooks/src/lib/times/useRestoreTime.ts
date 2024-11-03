import { useMutation } from '@tanstack/react-query';
import { Time } from '@models';

interface UseRestoreTimeProps extends Time {
  teamId: string;
  isA: boolean;
  isStart: boolean;
}

export function useRestoreTime() {
  return useMutation(['restore-time'], async (args: UseRestoreTimeProps) => {
    const response = await fetch('/api/teams/time', {
      method: 'POST',
      body: JSON.stringify({ ...args, type: 'restore' }),
    });

    if (!response.ok) throw new Error('Could not save the time');

    return { success: true };
  });
}
