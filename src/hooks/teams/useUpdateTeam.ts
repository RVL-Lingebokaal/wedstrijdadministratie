import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamAddForm } from "../../components/organisms/team/team-add-button/teamAddButton";

export interface UpdateTeamArgs extends Partial<TeamAddForm> {
  teamId: number;
}
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation(
    ["update-team"],
    async (args: UpdateTeamArgs) => {
      const response = await fetch("api/teams/update", {
        method: "POST",
        body: JSON.stringify(args),
      });

      if (!response.ok) throw new Error("Could not update the team");

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["get-teams"] }),
    }
  );
}
