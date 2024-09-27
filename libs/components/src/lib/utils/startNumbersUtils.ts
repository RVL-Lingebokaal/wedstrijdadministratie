import { Team } from '@models';

export function getBlocksForStartNumbers(teamData?: Team[]) {
  const block1 = new Set<Team>();
  const block2 = new Set<Team>();
  const block3 = new Set<Team>();

  if (!teamData) return { block1, block2, block3 };

  teamData.forEach((team) => {
    if (team.block === 1) {
      block1.add(team);
    } else if (team.block === 2) {
      block2.add(team);
    } else if (team.block === 3) {
      block3.add(team);
    }
  });

  return { block1, block2, block3 };
}
