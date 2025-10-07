import { NextRequest } from 'next/server';
import { teamService } from '@services';
import { Team, UseUpdateStartNumberTeamArgs } from '@models';
import { QUERY_PARAMS } from '@utils';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const { teams } = (await req.json()) as UseUpdateStartNumberTeamArgs;
  const existingTeams = await teamService.getTeams(wedstrijdId);
  const toBeSavedTeams = teams.reduce((acc, team) => {
    const existingTeam = existingTeams.find((et) => et.id === team.id);
    if (existingTeam) {
      existingTeam.startNumber = Number.parseInt(team.startNumber.toString());
      acc.push(existingTeam);
    }
    return acc;
  }, [] as Team[]);

  await teamService.saveTeams(toBeSavedTeams);

  return Response.json({ success: true });
}
