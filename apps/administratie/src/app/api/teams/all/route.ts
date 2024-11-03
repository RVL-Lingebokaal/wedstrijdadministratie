import { teamService } from '@services';
import { stringifySet } from '@utils';

export async function GET() {
  const teams = await teamService.getTeams();

  const arrayTeams = Array.from(teams.values());
  const jsonTeams: any[] = [];
  arrayTeams.forEach((t) => {
    const team = {
      ...t,
      participants: t.participants.map((p) => ({
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
