import { NextRequest } from 'next/server';
import { UpdateTeamArgs } from '@hooks';
import { boatService, participantService, teamService } from '@services';
import { Participant } from '@models';

export async function POST(req: NextRequest) {
  const args = (await req.json()) as UpdateTeamArgs;
  let team = args.teamId ? await teamService.getTeam(args.teamId) : undefined;

  if (!team) {
    return new Response(`Er bestaat geen team voor id: ${args.teamId}`, {
      status: 500,
    });
  }
  const participants = await participantService.getParticipants();
  const boats = await boatService.getBoats();
  team = {
    ...team,
    ...args,
    boat: boats.get(args.boat) ?? undefined,
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
