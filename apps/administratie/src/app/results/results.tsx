'use client';

import { useGetResults, useGetSettings, useGetTeams } from '@hooks';
import { GridHeader, GridRow, LoadingSpinner, Tabs } from '@components/server';
import { allAgesAreProcessed, getConvertedResults } from '@utils';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { useState } from 'react';

const headerItemsUncorrected = [
  'Slag',
  'Gevaren tijd',
  'Plaats',
  'Cat',
  'blok',
];
const headerItemsCorrected = [
  'Startnr',
  'Veld',
  'Ploeg',
  'Cat',
  'Gevaren tijd',
  'Gecorrigeerd',
  'Plaats',
];
enum ResultsTabs {
  uncorrected = 'Gevaren',
  corrected = 'Gecorrigeerd',
}

export default function ResultsPage() {
  const [tab, setTab] = useState<ResultsTabs[0]>(ResultsTabs.uncorrected);
  const { data: teamData, isLoading: teamIsLoading } = useGetTeams();
  const { data, isLoading } = useGetResults();
  const { data: settingsData, isLoading: settingsIsLoading } = useGetSettings();

  if (isLoading || settingsIsLoading || teamIsLoading) {
    return <LoadingSpinner />;
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

  const { rowsMap, headers, correctedRows } = getConvertedResults(
    settingsData?.classes ?? [],
    settingsData?.ages ?? [],
    settingsData?.boats ?? [],
    data
  );

  return (
    <div className="flex w-full ">
      <Tabs
        tabs={Object.values(ResultsTabs)}
        currentTab={tab}
        setTab={setTab}
      />
      <div className="w-full">
        {tab === ResultsTabs.uncorrected &&
          headers.map((header, index) => (
            <Disclosure key={header} defaultOpen>
              <DisclosureButton className="w-full">
                <GridHeader
                  items={['StartNr', header, ...headerItemsUncorrected]}
                  needsRounding={index === 0}
                />
              </DisclosureButton>
              <DisclosurePanel>
                {rowsMap.get(header)?.map((item, index) => {
                  item.splice(4, 0, { node: index + 1 });
                  return <GridRow items={item} key={index} />;
                })}
              </DisclosurePanel>
            </Disclosure>
          ))}
        {tab === ResultsTabs.corrected && (
          <div>
            <GridHeader items={headerItemsCorrected} />
            {correctedRows.map((item, index) => (
              <GridRow items={[...item, { node: index + 1 }]} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
