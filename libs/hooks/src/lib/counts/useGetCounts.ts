'use client';
import { useQuery } from '@tanstack/react-query';
import { GetCountsResponseDto, getCountsResponseDtoSchema } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useGetCounts(
  wedstrijdId: string,
  initialData: GetCountsResponseDto
) {
  return useQuery(
    ['get-counts'],
    async () => {
      const response = await fetch(
        `/api/counts?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        { method: 'GET' }
      );

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
      initialData,
    }
  );
}
