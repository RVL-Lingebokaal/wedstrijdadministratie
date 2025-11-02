'use client';
import { useQuery } from '@tanstack/react-query';
import { QUERY_PARAMS } from '@utils';

export function useCheckTeamBlock(wedstrijdId: string) {
  return useQuery(['check-team-blocks'], async () => {
    const response = await fetch(
      `/api/teams/check-blocks?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
      { method: 'GET' }
    );

    if (!response.ok) throw new Error('Could not get results for teams');

    return await response.json();
  });
}
