import { participantService, settingsService, teamService } from '@services';

export async function getCounts(wedstrijdId: string) {
  const teams = await teamService.getTeams(wedstrijdId);
  const participants = await participantService.getParticipants(wedstrijdId);
  const clubs = Array.from(teams.values()).reduce<Set<string>>(
    (acc, team) => acc.add(team.club),
    new Set()
  );
  const date = await settingsService.getGeneralSettings();

  return {
    teamsSize: teams.length,
    participantsSize: participants.size,
    clubsSize: clubs.size,
    date: date.date,
  };
}
