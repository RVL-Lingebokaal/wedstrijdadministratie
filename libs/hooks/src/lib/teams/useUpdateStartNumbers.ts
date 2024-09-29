import { useMutation } from '@tanstack/react-query';
import { UseUpdateStartNumberTeamArgs } from '@models';

export function useUpdateStartNumbers() {
  return useMutation(
    ['update-start-numbers'],
    async (args: UseUpdateStartNumberTeamArgs) => {
      const response = await fetch('api/teams/update-start-number', {
        method: 'POST',
        body: JSON.stringify(args),
      });

      if (!response.ok)
        throw new Error('Could not update the start number of team');

      return { success: true };
    }
  );
}
