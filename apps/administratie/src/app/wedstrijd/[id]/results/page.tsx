import { allAgesAreProcessed, getConvertedResults } from '@utils';
import { OverviewResults } from '@components';
import { teamService, wedstrijdService } from '@services';

export default async function ResultsPage({
  params: { id },
}: ParamsWithWedstrijdId) {
  const teams = await teamService.getTeams(id);
  const result = await teamService.getResults(id);
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

  const { rowsMap, headers, correctedRows } = getConvertedResults(
    wedstrijdSettings.classes ?? [],
    wedstrijdSettings.ages,
    wedstrijdSettings.boats,
    result,
    wedstrijdSettings.general.isJeugd ?? false
  );

  return (
    <OverviewResults
      correctedRows={correctedRows}
      rowsMap={rowsMap}
      headers={headers}
    />
  );
}
