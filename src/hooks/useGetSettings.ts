import { useQuery } from "@tanstack/react-query";
import { Settings } from "../models/settings";

export function useGetSettings() {
  return useQuery(
    ["retrieve-settings"],
    async () => {
      const response = await fetch("/api/settings", { method: "GET" });

      if (!response.ok) throw new Error("Could not get settings");

      return (await response.json()) as Settings;
    },
    { keepPreviousData: true }
  );
}
