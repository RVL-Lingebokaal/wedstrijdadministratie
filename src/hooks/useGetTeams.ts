import { useQuery } from "@tanstack/react-query";
import { Team } from "../models/team";
import { Participant } from "../models/participant";

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
            participants: team.participants.map((p: any) => new Participant(p)),
          })
      );
    },
    {
      keepPreviousData: true,
    }
  );
}
