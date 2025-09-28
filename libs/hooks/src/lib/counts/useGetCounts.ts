'use client';
import { useQuery } from '@tanstack/react-query';
import { getCountsResponseDtoSchema } from '@models';

export function useGetCounts() {
  return useQuery(
    ['get-counts'],
    async () => {
      const response = await fetch('/api/counts', { method: 'GET' });

      if (!response.ok) throw new Error('Could not get counts');

      const parsedData = getCountsResponseDtoSchema.safeParse(
        await response.json()
      );

      if (!parsedData.success) {
        throw new Error('Could not parse response from server');
      }

      return parsedData.data;
    },
    {
      keepPreviousData: true,
    }
  );
}
