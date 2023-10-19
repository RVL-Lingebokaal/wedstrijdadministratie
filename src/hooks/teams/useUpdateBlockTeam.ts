import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateBlockArgs } from "../../pages/api/teams/update-block";

interface UseUpdateBlockTeamProps {
  onError: () => void;
}

export function useUpdateBlockTeam({ onError }: UseUpdateBlockTeamProps) {
  const queryClient = useQueryClient();

  return useMutation(
    ["update-block-team"],
    async (args: UpdateBlockArgs) => {
      const response = await fetch("api/teams/update-block", {
        method: "POST",
        body: JSON.stringify(args),
      });

      const result = (await response.json()) as any;

      if (result.errorMessage) {
        return Promise.reject(result.errorMessage);
      }

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["get-teams"] }),
      onError,
    }
  );
}
