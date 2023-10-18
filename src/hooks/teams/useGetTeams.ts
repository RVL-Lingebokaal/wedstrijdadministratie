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
      console.log(result);
      return result.map((team) => {
        return new Team({
          ...team,
          preferredBlock: parseInt(team.preferredBlock),
          participants: team.participants.map(
            (p: any) =>
              new Participant({
                ...p,
                blocks: new Set(JSON.parse(p.blocks)),
              })
          ),
          boat: new Boat(team.boat),
          helm: team.helm
            ? new Participant({
                ...team.helm,
                blocks: new Set(JSON.parse(team.helm.blocks)),
              })
            : null,
        });
      });
    },
    {
      keepPreviousData: true,
    }
  );
}
