import type { NextApiRequest, NextApiResponse } from "next";
import participantService from "../../services/participantService.server";
import teamService from "../../services/teamService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    teamsSize: number;
    participantsSize: number;
    clubsSize: number;
  }>
) {
  const teams = await teamService.getTeams();
  const participants = await participantService.getParticipants();
  const clubs = teams.reduce<Set<string>>(
    (acc, team) => acc.add(team.getClub()),
    new Set()
  );

  res.status(200).send({
    teamsSize: teams.length,
    participantsSize: participants.size,
    clubsSize: clubs.size,
  });
}
