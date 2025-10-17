import { SettingData, Settings, Team, WedstrijdIdProps } from '@models';
import { GridHeader, GridRow } from '@components/server';
import { useMemo } from 'react';
import {
  getTeamsForStartNumbers,
  sortTeamsWithStartNumber,
} from '../../../utils/startNumbersUtils';
import { useUpdateStartNumbers } from '@hooks';

interface StartNumbersGridProps extends WedstrijdIdProps {
  teamData: Team[];
  settingsData: Omit<Settings, 'general'>;
  generalSettingsData: SettingData;
}

const headerItems = ['Startnr', 'Blok', 'Veld', 'Ploegnaam', 'Slag', 'Boot'];

export function StartNumbersGrid({
  teamData,
  settingsData,
  generalSettingsData,
  wedstrijdId,
}: StartNumbersGridProps) {
  const { mutate } = useUpdateStartNumbers({ wedstrijdId });
  const hasTeamsWithoutStartNumber = teamData?.some(
    (team) => !team.startNumber
  );
  const rows = useMemo(() => {
    const props = {
      teams: teamData,
      classes: settingsData?.classes ?? [],
      missingNumbers: generalSettingsData?.missingNumbers ?? [],
    };
    return hasTeamsWithoutStartNumber
      ? getTeamsForStartNumbers({
          ...props,
          saveData: mutate,
          isJeugdWedstrijd: generalSettingsData?.isJeugd ?? false,
        })
      : sortTeamsWithStartNumber({
          ...props,
          isJeugdWedstrijd: generalSettingsData?.isJeugd ?? false,
        });
  }, [teamData, settingsData, hasTeamsWithoutStartNumber]);

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
