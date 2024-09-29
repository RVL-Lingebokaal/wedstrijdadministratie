import { NextRequest } from 'next/server';
import { teamService } from '@services';
import { Team, UseUpdateStartNumberTeamArgs } from '@models';

export async function POST(req: NextRequest) {
  const { teams } = (await req.json()) as UseUpdateStartNumberTeamArgs;
  const existingTeams = await teamService.getTeams();
  const toBeSavedTeams = teams.reduce((acc, team) => {
    const existingTeam = existingTeams.get(team.id);
    if (existingTeam) {
      existingTeam.startNumber = Number.parseInt(team.startNumber);
      acc.push(existingTeam);
    }
    return acc;
  }, [] as Team[]);

  await teamService.saveTeams(toBeSavedTeams);

  return Response.json({ success: true });
}
