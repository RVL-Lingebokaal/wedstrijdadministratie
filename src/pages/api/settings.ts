import { NextApiRequest, NextApiResponse } from "next";
import settingsService, {
  ItemsToSave,
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

    return res.status(200).send({ success: true });
  } else {
    const settings = await settingsService.getSettings();

    return res.status(200).send(settings);
  }
}
