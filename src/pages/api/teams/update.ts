import { NextApiRequest, NextApiResponse } from "next";
import { UpdateTeamArgs } from "../../../hooks/teams/useUpdateTeam";
import teamService from "../../../services/teamService.server";
import { Participant } from "../../../models/participant";
import boatService from "../../../services/boatService.server";
import participantService from "../../../services/participantService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(500).json({ error: "Alleen POST methodes zijn toegestaan" });
  }

  const args = JSON.parse(req.body) as UpdateTeamArgs;
  let team = args.teamId ? await teamService.getTeam(args.teamId) : undefined;

  if (!team) {
    return res
      .status(500)
      .json({ error: `Er bestaat geen team voor id: ${args.teamId}` });
  }
  const participants = await participantService.getParticipants();
  const boats = await boatService.getBoats();
  team = {
    ...team,
    ...args,
    boat: boats.get(args.boat) ?? undefined,
    helm: participants.get(args.helm?.id ?? "") ?? null,
    participants:
      args.participants?.map((p) => ({
        ...p,
        ...(participants.get(p.id ?? "") as Participant),
      })) ?? team.participants,
  };
  await teamService.saveTeam(team);

  return res.status(200).send({ success: true });
}
