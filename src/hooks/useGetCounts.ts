import { useQuery } from "@tanstack/react-query";

export function useGetCounts() {
  return useQuery(
    ["get-counts"],
    async () => {
      const response = await fetch("/api/counts", { method: "GET" });

      if (!response.ok) throw new Error("Could not get counts");

      return (await response.json()) as {
        teamsSize: number;
        participantsSize: number;
        clubsSize: number;
        date: string;
      };
    },
    {
      keepPreviousData: true,
    }
  );
}
