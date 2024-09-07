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
      date: string;
    };
    if (args.type === "general") {
      await settingsService.saveGeneralSettings({ date: args.date });
      return res.status(200).send({ success: true });
    }

    await settingsService.saveSettings(args.type, args.items);

    return res.status(200).send({ success: true });
  } else if (req.method === "GET") {
    if (req.query.type === "general") {
      const generalSettings = await settingsService.getGeneralSettings();

      return res.status(200).send(generalSettings);
    }
    const settings = await settingsService.getSettings();

    return res.status(200).send(settings);
  }
}
