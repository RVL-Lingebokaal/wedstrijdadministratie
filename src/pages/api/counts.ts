import type { NextApiRequest, NextApiResponse } from "next";
import { teamService } from "../../services/teamService.server";
import { participantService } from "../../services/participantService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ teamsSize: number; participantsSize: number }>
) {
  const teams = await teamService.getTeams();
  const participants = await participantService.getParticipants();
  res
    .status(200)
    .json({ teamsSize: teams.length, participantsSize: participants.size });
}
