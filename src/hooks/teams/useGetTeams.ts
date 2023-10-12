import { useQuery } from "@tanstack/react-query";
import { Team } from "../../models/team";
import { Participant } from "../../models/participant";
import { Boat } from "../../models/boat";

export function useGetTeams() {
  return useQuery(
    ["get-teams"],
    async () => {
      const response = await fetch("/api/teams/all", { method: "GET" });

      if (!response.ok) throw new Error("Could not get teams");

      const result = (await response.json()) as any[];
      return result.map(
        (team) =>
          new Team({
            ...team,
            preferredBlock: parseInt(team.preferredBlock),
            participants: team.participants.map((p: any) => new Participant(p)),
            boat: new Boat(team.boat),
            helm: team.helm ? new Participant(team.helm) : null,
          })
      );
    },
    {
      keepPreviousData: true,
    }
  );
}
