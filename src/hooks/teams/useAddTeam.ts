import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamAddForm } from "../../components/organisms/team/team-add-button/teamAddButton";

export function useAddTeam() {
  const queryClient = useQueryClient();

  return useMutation(
    ["save-team"],
    async (args: TeamAddForm) => {
      const response = await fetch("/api/teams/create", {
        method: "POST",
        body: JSON.stringify(args),
      });

      if (!response.ok) throw new Error("Could not save the team");

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["get-teams"] }),
    }
  );
}
