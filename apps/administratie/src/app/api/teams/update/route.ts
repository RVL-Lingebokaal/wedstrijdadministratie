import { NextRequest } from 'next/server';
import { UpdateTeamArgs } from '@hooks';
import { boatService, participantService, teamService } from '@services';
import { getBoatId, Participant } from '@models';
import { QUERY_PARAMS } from '@utils';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const args = (await req.json()) as UpdateTeamArgs;
  let team = args.teamId
    ? await teamService.getTeam(args.teamId, wedstrijdId)
    : undefined;

  if (!team) {
    return new Response(`Er bestaat geen team voor id: ${args.teamId}`, {
      status: 500,
    });
  }
  const participants = await participantService.getParticipants(wedstrijdId);
  const boats = await boatService.getBoats(wedstrijdId);
  let boat = boats.get(args.boat);

  if (args.boat && !boat) {
    boat = {
      name: args.boat,
      club: team.club,
      blocks: new Set([args.preferredBlock]),
      id: getBoatId(args.boat, team.club),
      wedstrijdId,
    };
    await boatService.saveBoats([boat]);
  }
  team = {
    ...team,
    ...args,
    boat: boat ?? null,
    helm: participants.get(args.helm?.id ?? '') ?? null,
    participants:
      args.participants?.map((p) => ({
        ...p,
        ...(participants.get(p.id ?? '') as Participant),
      })) ?? team.participants,
  };
  await teamService.saveTeam(team);

  return Response.json({ success: true });
}
