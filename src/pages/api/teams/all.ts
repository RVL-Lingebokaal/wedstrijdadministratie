import { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../../services/teamService.server";
import { stringifySet } from "../../../utils/blocks";

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
      ...t,
      participants: t.participants.map((p) => ({
        ...p,
        blocks: stringifySet(p.blocks),
      })),
      boat: t.boat,
      helm: t.helm ? { ...t.helm, blocks: stringifySet(t.helm.blocks) } : null,
    };
    jsonTeams.push(team);
  });

  return res.status(200).send(jsonTeams);
}
