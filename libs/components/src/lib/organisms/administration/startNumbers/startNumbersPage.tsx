import { useGetGeneralSettings, useGetSettings, useGetTeams } from '@hooks';
import { LoadingSpinner } from '@components/server';
import { allAgesAreProcessed } from '@utils';
import { StartNumbersGrid } from './startNumbersGrid';
import { WedstrijdIdProps } from '@models';

export function StartNumbersPage({ wedstrijdId }: WedstrijdIdProps) {
  const { data: teamData, isLoading: teamIsLoading } = useGetTeams(wedstrijdId);
  const { data: settingsData, isLoading: settingsIsLoading } =
    useGetSettings(wedstrijdId);
  const { data: generalSettingsData, isLoading: generalSettingsIsLoading } =
    useGetGeneralSettings(wedstrijdId);

  if (settingsIsLoading || teamIsLoading || generalSettingsIsLoading) {
    return <LoadingSpinner />;
  }

  if (!teamData || !settingsData || !generalSettingsData) {
    return 'Er is geen data gevonden';
  }

  const { processed } = allAgesAreProcessed(
    teamData ?? [],
    settingsData?.classes ?? []
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
    <StartNumbersGrid
      generalSettingsData={generalSettingsData}
      settingsData={settingsData}
      teamData={teamData}
      wedstrijdId={wedstrijdId}
    />
  );
}
