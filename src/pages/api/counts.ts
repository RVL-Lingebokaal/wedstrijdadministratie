import type { NextApiRequest, NextApiResponse } from "next";
import participantService from "../../services/participantService.server";
import teamService from "../../services/teamService.server";
import settingsService from "../../services/settingsService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    teamsSize: number;
    participantsSize: number;
    clubsSize: number;
    date: string;
  }>
) {
  const teams = await teamService.getTeams();
  const participants = await participantService.getParticipants();
  const clubs = Array.from(teams.values()).reduce<Set<string>>(
    (acc, team) => acc.add(team.club),
    new Set()
  );
  const date = await settingsService.getGeneralSettings();

  res.status(200).send({
    teamsSize: teams.size,
    participantsSize: participants.size,
    clubsSize: clubs.size,
    date: date.date,
  });
}
