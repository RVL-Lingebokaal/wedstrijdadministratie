import { participantService, settingsService, teamService } from '@services';
import { QUERY_PARAMS } from '@utils';
import { NextRequest } from 'next/server';

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

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const result = await getCounts(wedstrijdId);

  return Response.json(result);
}
