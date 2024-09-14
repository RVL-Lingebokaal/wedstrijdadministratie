import { participantService, settingsService, teamService } from '@services';

export async function GET() {
  const teams = await teamService.getTeams();
  const participants = await participantService.getParticipants();
  const clubs = Array.from(teams.values()).reduce<Set<string>>(
    (acc, team) => acc.add(team.club),
    new Set()
  );
  const date = await settingsService.getGeneralSettings();

  return Response.json({
    teamsSize: teams.size,
    participantsSize: participants.size,
    clubsSize: clubs.size,
    date: date.date,
  });
}
