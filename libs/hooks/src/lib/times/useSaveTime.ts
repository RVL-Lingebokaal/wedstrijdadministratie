'use client';
import { useMutation } from '@tanstack/react-query';
import { SaveStartNumberTime } from '@models';

export function useSaveTime() {
  return useMutation(['save-time'], async (args: SaveStartNumberTime) => {
    const response = await fetch('/api/teams/time/koppel', {
      method: 'POST',
      body: JSON.stringify(args),
    });

    if (!response.ok) throw new Error('Could not save the time');

    return { success: true };
  });
}
