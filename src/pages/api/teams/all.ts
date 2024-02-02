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

  const arrayTeams = Array.from(teams.values());
  const jsonTeams: any[] = [];
  arrayTeams.forEach((t) => {
    const team = {
      ...t.getDatabaseTeam(),
      participants: t.getParticipants().map((p) => p.getDatabaseParticipant()),
      boat: t.getBoat(),
      helm: t.getHelm() ? t.getHelm()?.getDatabaseParticipant() : null,
    };
    jsonTeams.push(team);
  });

  return res.status(200).send(jsonTeams);
}
