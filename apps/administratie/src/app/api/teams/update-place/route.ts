import { NextRequest } from 'next/server';
import { Team, UpdatePlaceArgs } from '@models';
import { teamService } from '@services';

export async function POST(req: NextRequest) {
  const { teamsWithPlace } = (await req.json()) as UpdatePlaceArgs;
  const teams: Team[] = [];
  await Promise.all(
    teamsWithPlace.map(async (teamId, index) => {
      const team = await teamService.getTeam(teamId);

      if (!team) {
        return new Response('Er bestaat geen team met dit ID', { status: 500 });
      }

      team.place = index;
      team.startNumber = undefined;
      teams.push(team);
    })
  );

  await teamService.saveTeams(teams);

  return Response.json({ success: true });
}
