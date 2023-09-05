import { NextApiRequest, NextApiResponse } from "next";
import {
  ItemsToSave,
  settingsService,
  SettingsType,
} from "../../services/settingsService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const args = JSON.parse(req.body) as {
      type: SettingsType;
      items: ItemsToSave;
    };
    await settingsService.saveSettings(args.type, args.items);

    res.status(200);
  } else {
    const settings = await settingsService.getSettings();
    res.status(200).json(settings);
  }

  return res;
}
