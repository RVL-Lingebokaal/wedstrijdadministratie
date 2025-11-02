import { teamService } from '@services';
import { QUERY_PARAMS, stringifySet } from '@utils';
import { Participant } from '@models';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const teams = await teamService.getTeams(wedstrijdId);

  const jsonTeams: any[] = [];
  teams.forEach((t) => {
    const team = {
      ...t,
      participants: t.participants.map((p: Participant) => ({
        ...p,
        blocks: stringifySet(p.blocks),
      })),
      boat: t.boat,
      helm: t.helm ? { ...t.helm, blocks: stringifySet(t.helm.blocks) } : null,
    };
    jsonTeams.push(team);
  });

  return Response.json(jsonTeams);
}
