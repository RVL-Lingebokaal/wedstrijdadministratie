import { teamService } from '@services';
import { stringifySet } from '@utils';
import { Participant } from '@models';

export async function GET() {
  const teams = await teamService.getTeams();

  Array.from(teams.values()).forEach((t) => {
    if (t.id === '792267') {
      console.log('block', t.block);
    }
  });

  const arrayTeams = Array.from(teams.values());
  const jsonTeams: any[] = [];
  arrayTeams.forEach((t) => {
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
