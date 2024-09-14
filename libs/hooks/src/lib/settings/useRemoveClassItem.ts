'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassItem } from '@models';

export function useRemoveClassItem() {
  const queryClient = useQueryClient();

  return useMutation(
    ['remove-class-item'],
    async (args: ClassItem) => {
      const response = await fetch('/api/settings/remove', {
        method: 'POST',
        body: JSON.stringify(args),
      });

      if (!response.ok) throw new Error('Could not remove class item');

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['retrieve-settings'] }),
    }
  );
}
