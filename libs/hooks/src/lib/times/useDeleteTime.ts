'use client';
import { useMutation } from '@tanstack/react-query';
import { Time } from '@models';

export function useDeleteTime() {
  return useMutation(['delete-time'], async (args: Time) => {
    const response = await fetch('/api/teams/time', {
      method: 'POST',
      body: JSON.stringify(args),
    });

    if (!response.ok) throw new Error('Could not save the time');

    return { success: true };
  });
}
