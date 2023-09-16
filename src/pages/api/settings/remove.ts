import { NextApiRequest, NextApiResponse } from "next";
import { ClassItem } from "../../../models/settings";
import settingsService from "../../../services/settingsService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const args = JSON.parse(req.body) as ClassItem;
    await settingsService.removeClassItem(args);

    return res.status(200).send({ success: true });
  }
}
