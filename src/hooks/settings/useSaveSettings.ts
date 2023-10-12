import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ItemsToSave,
  SettingsType,
} from "../../services/settingsService.server";

interface SaveSettinsArgs {
  type: SettingsType;
  items: ItemsToSave;
}
export function useSaveSettings() {
  const queryClient = useQueryClient();

  return useMutation(
    ["save-settings"],
    async (args: SaveSettinsArgs) => {
      const response = await fetch("/api/settings", {
        method: "POST",
        body: JSON.stringify(args),
      });

      if (!response.ok) throw new Error("Could not save settings");

      return { success: true };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["retrieve-settings"] }),
    }
  );
}
