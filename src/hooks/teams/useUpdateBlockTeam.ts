import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateBlockArgs } from "../../pages/api/teams/update-block";

export function useUpdateBlockTeam() {
  const queryClient = useQueryClient();

  return useMutation(
    ["update-block-team"],
    async (args: UpdateBlockArgs) => {
      const response = await fetch("api/teams/update-block", {
        method: "POST",
        body: JSON.stringify(args),
      });

      if (!response.ok) {
        throw new Error("Could not update the team");
      }
      console.log(response);

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["get-teams"] }),
    }
  );
}
