import { TeamAddButton, TeamUpdateButton } from '@components';
import { teamService } from '@services';

export default async function Page({ params: { id } }: ParamsWithWedstrijdId) {
  const teams = await teamService.getTeams(id);

  return (
    <div>
      <h1 className="font-bold text-2xl mb-3 text-primary">Data</h1>
      <h2 className="font-bold text-xl mb-2">Ploegen</h2>
      <p className="mb-2">
        Er zijn op dit moment {teams.length} teams ingeschreven.
      </p>
      <div className="flex gap-3">
        <TeamAddButton wedstrijdId={id} />
        <TeamUpdateButton teams={teams} wedstrijdId={id} />
      </div>
    </div>
  );
}
