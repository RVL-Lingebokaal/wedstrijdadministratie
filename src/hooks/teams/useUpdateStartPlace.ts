import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateStartPlaceArgs } from "../../pages/api/teams/update-startplace";

export function useUpdateStartPlace() {
  const queryClient = useQueryClient();

  return useMutation(
    ["update-start-place-team"],
    async (args: UpdateStartPlaceArgs) => {
      const response = await fetch("api/teams/update-startplace", {
        method: "POST",
        body: JSON.stringify(args),
      });

      if (!response.ok)
        throw new Error("Could not update the start place of the teams");

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["get-teams"] }),
    }
  );
}
