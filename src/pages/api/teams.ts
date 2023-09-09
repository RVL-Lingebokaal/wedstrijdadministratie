import type { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../services/teamService.server";
import { Team } from "../../models/team";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Team[]>
) {
  const teams = await teamService.getTeams();
  res.status(200).json(teams);
}
