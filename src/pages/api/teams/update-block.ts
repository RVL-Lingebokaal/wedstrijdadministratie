import { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../../services/teamService.server";

export interface UpdateBlockArgs {
  teamId: string;
  destBlock: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(500)
      .json({ error: "Alleen POST methodes zijn toegestaan" });
  }

  const args = JSON.parse(req.body) as UpdateBlockArgs;
  const team = await teamService.getTeam(args.teamId);
  if (!team) {
    return res.status(500).json({ error: "Er bestaat geen team met dit ID" });
  }

  try {
    team.setPreferredBlock(args.destBlock);
    await teamService.saveTeam(team);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
