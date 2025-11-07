import { SettingData, Settings, Team, WedstrijdIdProps } from '@models';
import { GridHeader, GridRow } from '@components/server';
import { ReactNode, useCallback, useMemo } from 'react';
import { sortTeamsWithStartNumber } from '../../../utils/startNumbersUtils';
import { useSaveGeneralSettings } from '@hooks';
import { Checkbox } from '../../../molecules/checkbox/checkbox';

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
  const { mutate: setSettings } = useSaveGeneralSettings({ wedstrijdId });
  // const { mutate } = useUpdateStartNumbers({ wedstrijdId });
  const hasTeamsWithoutStartNumber = teamData?.some(
    (team) => !team.startNumber
  );
  console.log({ hasTeamsWithoutStartNumber });
  const { items, unsubscribedTeams } = useMemo(() => {
    const props = {
      teams: teamData,
      classes: settingsData?.classes ?? [],
      missingNumbers: generalSettingsData?.missingNumbers ?? [],
    };
    return sortTeamsWithStartNumber({
      ...props,
      isJeugdWedstrijd: generalSettingsData?.isJeugd ?? false,
    });
  }, [teamData, settingsData, hasTeamsWithoutStartNumber]);

  const onClickCheckbox = useCallback(
    (value: boolean) => {
      setSettings({ startNumbersAreFixed: value });
    },
    [setSettings]
  );

  console.log({ unsubscribedTeams });
  return (
    <div className="flex w-full">
      <div className="w-full">
        <div className="p-2">
          <p>
            Zodra de loting is geweest, mogen de startnummers niet meer worden
            gewijzigd. Deze optie kan hieronder worden aangezet.
          </p>
          <Checkbox
            enabled={generalSettingsData.startNumbersAreFixed ?? false}
            setEnabled={onClickCheckbox}
            label="De startnummer kunnen niet meer worden gewijzigd"
          />
        </div>
        <GridHeader items={headerItems} needsRounding classNames="mt-0" />
        {items.map((row) => (
          <GridRow
            classNames={
              checkIfUnsubscribed(unsubscribedTeams, row[0]?.node)
                ? 'line-through'
                : ''
            }
            items={row}
            key={row[0]?.node?.toString() ?? ''}
          />
        ))}
      </div>
    </div>
  );
}

function checkIfUnsubscribed(
  unsubscribedTeams: Set<number>,
  startNumber: ReactNode | string
) {
  const stringStart = startNumber?.toString();
  if (!stringStart) return false;

  const parsed = Number.parseInt(stringStart);

  if (isNaN(parsed)) return false;

  return unsubscribedTeams.has(parsed);
}
