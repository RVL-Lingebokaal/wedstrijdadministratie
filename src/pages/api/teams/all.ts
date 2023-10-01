import { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../../services/teamService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(500).json({ error: "Alleen GET methodes mogen" });
  }
  const teams = await teamService.getTeams();
  return res.status(200).send(Array.from(teams.values()));
}
