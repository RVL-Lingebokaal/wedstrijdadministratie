import { useMutation } from '@tanstack/react-query';
import { UseUpdateStartNumberTeamArgs, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

export function useUpdateStartNumbers({ wedstrijdId }: WedstrijdIdProps) {
  return useMutation(
    ['update-start-numbers'],
    async (args: UseUpdateStartNumberTeamArgs) => {
      const response = await fetch(
        `/api/teams/update-start-number?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'POST',
          body: JSON.stringify(args),
        }
      );

      if (!response.ok)
        throw new Error('Could not update the start number of team');

      return { success: true };
    }
  );
}
