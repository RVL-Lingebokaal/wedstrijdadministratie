'use client';
import { useQuery } from '@tanstack/react-query';
import { QUERY_PARAMS } from '@utils';
import { getResultsForTeamsSchema } from '@models';

export function useGetResultsForTeams(wedstrijdId: string) {
  return useQuery(['get-results-teams'], async () => {
    const response = await fetch(
      `/api/teams/results?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
      { method: 'GET' }
    );

    if (!response.ok) throw new Error('Could not get results for teams');

    const results = getResultsForTeamsSchema.safeParse(await response.json());

    if (!results.success) {
      throw new Error('Invalid results for teams data');
    }

    return results.data;
  });
}
