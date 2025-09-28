'use client';
import { useMutation } from '@tanstack/react-query';
import { WedstrijdAddForm } from '@schemas';
import { createWedstrijdDtoResponseSchema } from '@models';
import { useRouter } from 'next/navigation';

export function useCreateWedstrijd() {
  const router = useRouter();

  return useMutation(
    ['create-wedstrijd'],
    async (args: WedstrijdAddForm) => {
      const response = await fetch('/api/wedstrijd/create', {
        method: 'POST',
        body: JSON.stringify(args),
      });

      if (!response.ok) throw new Error('Could not save the wedstrijd');

      const parsed = createWedstrijdDtoResponseSchema.safeParse(
        await response.json()
      );
      if (!parsed.success)
        throw new Error('Could not parse response from server');

      return { id: parsed.data.wedstrijdId };
    },
    {
      onSuccess: (data) => {
        router.push(`/wedstrijd/${data.id}`);
      },
    }
  );
}
