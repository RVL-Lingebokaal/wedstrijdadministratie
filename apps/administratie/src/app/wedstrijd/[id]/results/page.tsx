import { allAgesAreProcessed } from '@utils';
import { OverviewResults } from '@components';
import { teamService, wedstrijdService } from '@services';

export default async function ResultsPage({
  params: { id },
}: ParamsWithWedstrijdId) {
  const teams = await teamService.getTeams(id);
  const wedstrijdSettings = await wedstrijdService.getSettingsFromWedstrijd(id);

  const { processed } = allAgesAreProcessed(
    teams,
    wedstrijdSettings.classes ?? []
  );

  if (!processed) {
    return (
      <h2>
        Er zijn nog teams die niet zijn verwerkt. Ga naar de Administratie
        pagina om alle teams aan een klasse toe te wijzen.
      </h2>
    );
  }

  return (
    <OverviewResults
      isJeugdWedstrijd={wedstrijdSettings.general?.isJeugd ?? false}
      wedstrijdId={id}
      classItems={wedstrijdSettings.classes ?? []}
    />
  );
}
