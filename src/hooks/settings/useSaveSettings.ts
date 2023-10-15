import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ItemsToSave,
  SettingsType,
} from "../../services/settingsService.server";

interface SaveSettinsArgs {
  type: SettingsType;
  items: ItemsToSave;
}

interface UseSaveSettingsProps {
  onSuccess: () => void;
}

export function useSaveSettings({ onSuccess }: UseSaveSettingsProps) {
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
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["retrieve-settings"],
        });
        onSuccess();
      },
    }
  );
}
