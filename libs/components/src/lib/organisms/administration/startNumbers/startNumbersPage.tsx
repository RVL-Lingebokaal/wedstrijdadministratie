import { useGetSettings, useGetTeams } from '@hooks';
import { GridHeader, GridRow, LoadingSpinner } from '@components/server';
import { allAgesAreProcessed } from '@utils';
import { useMemo } from 'react';
import {
  getTeamsForStartNumbers,
  sortTeamsWithStartNumber,
} from '../../../utils/startNumbersUtils';
import { useUpdateStartNumbers } from '../../../../../../hooks/src/lib/teams/useUpdateStartNumbers';

const headerItems = ['Startnr', 'Blok', 'Veld', 'Ploegnaam', 'Slag', 'Boot'];

export function StartNumbersPage() {
  const { data: teamData, isLoading: teamIsLoading } = useGetTeams();
  const { data: settingsData, isLoading: settingsIsLoading } = useGetSettings();
  const { mutate } = useUpdateStartNumbers();

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
  const hasTeamsWithoutStartNumber = teamData?.some(
    (team) => !team.startNumber
  );
  const rows = useMemo(() => {
    const props = {
      teamData,
      ages: settingsData?.ages ?? [],
      classes: settingsData?.classes ?? [],
      missingNumbers: settingsData?.general.missingNumbers ?? [],
    };
    return hasTeamsWithoutStartNumber
      ? getTeamsForStartNumbers({ ...props, saveData: mutate })
      : sortTeamsWithStartNumber(props);
  }, [teamData, settingsData]);

  return (
    <div className="flex w-full">
      <div className="w-full">
        <GridHeader items={headerItems} needsRounding classNames="mt-0" />
        {rows.map((row) => (
          <GridRow items={row} key={row[0]?.node?.toString() ?? ''} />
        ))}
      </div>
    </div>
  );
}
