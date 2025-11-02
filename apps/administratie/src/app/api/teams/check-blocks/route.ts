import { teamService } from '@services';
import { QUERY_PARAMS } from '@utils';
import { Participant } from '@models';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const teams = await teamService.getTeams(wedstrijdId);

  const teamsBlockMap = new Map<number, any[]>();

  teams.forEach((team) => {
    const block = team.block ?? team.preferredBlock;
    if (!block) throw new Error('Missing block for team ' + team.id);
    const existing = teamsBlockMap.get(block) ?? ([] as any[]);
    existing.push(team);
    teamsBlockMap.set(block, existing);
  });

  teamsBlockMap.forEach((teamsInBlock, block) => {
    const participantSet = new Set();
    const boatSet = new Set();

    teamsInBlock.forEach((team) => {
      team.participants.forEach((participant: Participant) => {
        if (participantSet.has(participant.id)) {
          console.log(
            `Conflict in block ${block} participant: ${team.name} ${team.boatType} ${team.gender}`
          );
        }

        participantSet.add(participant.id);
      });
      if (team.helm) {
        if (participantSet.has(team.helm.id)) {
          console.log(
            `Conflict in block ${block} helm: ${team.name} ${team.boatType} ${team.gender}`
          );
        }

        participantSet.add(team.helm.id);
      }
      if (team.boat) {
        if (boatSet.has(team.boat.id)) {
          console.log(
            `Conflict in block ${block} boat: ${team.name} ${team.boatType} ${team.gender}`
          );
        }

        boatSet.add(team.boat.id);
      }
    });
  });

  return Response.json({ success: true });
}
