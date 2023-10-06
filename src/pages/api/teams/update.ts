import { NextApiRequest, NextApiResponse } from "next";
import { UpdateTeamArgs } from "../../../hooks/teams/useUpdateTeam";
import teamService from "../../../services/teamService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(500).json({ error: "Alleen POST methodes zijn toegestaan" });
  }

  const args = JSON.parse(req.body) as UpdateTeamArgs;
  const team = args.teamId ? await teamService.getTeam(args.teamId) : undefined;

  if (!team) {
    return res
      .status(500)
      .json({ error: `Er bestaat geen team voor id: ${args.teamId}` });
  }

  await team.updateTeam(args);

  return res.status(200).send({ success: true });
}
