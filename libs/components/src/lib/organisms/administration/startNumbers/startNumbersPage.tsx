import { useGetSettings, useGetTeams } from '@hooks';
import { LoadingSpinner } from '@components/server';
import { allAgesAreProcessed } from '@utils';
import { useMemo } from 'react';
import { getBlocksForStartNumbers } from '../../../utils/startNumbersUtils';

export function StartNumbersPage() {
  const { data: teamData, isLoading: teamIsLoading } = useGetTeams();
  const { data: settingsData, isLoading: settingsIsLoading } = useGetSettings();

  if (settingsIsLoading || teamIsLoading) {
    return <LoadingSpinner />;
  }

  const { processed } = allAgesAreProcessed(
    settingsData?.ages ?? [],
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
  const { block1, block2, block3 } = useMemo(
    () => getBlocksForStartNumbers(teamData),
    [teamData]
  );
  const missingNumbers = settingsData?.general.missingNumbers ?? [];

  return (
    <div>
      <h2>Startnummers</h2>
    </div>
  );
}
