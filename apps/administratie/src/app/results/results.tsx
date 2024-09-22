'use client';

import { useGetResults, useGetSettings, useGetTeams } from '@hooks';
import { GridHeader, GridRow, LoadingSpinner } from '@components/server';
import { allAgesAreProcessed, getConvertedResults } from '@utils';
import { Disclosure } from '@headlessui/react';

const headerItems = ['Start', 'Finish', 'Resultaat', 'Gecorrigeerd'];

export default function ResultsPage() {
  const { data: teamData, isLoading: teamIsLoading } = useGetTeams();
  const { data, isLoading } = useGetResults();
  const { data: settingsData, isLoading: settingsIsLoading } = useGetSettings();

  if (isLoading || settingsIsLoading || teamIsLoading) {
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

  const { rowsMap, headers } = getConvertedResults(
    settingsData?.classes ?? [],
    settingsData?.ages ?? [],
    data
  );

  return (
    <div className="flex w-full">
      <div className="w-full">
        {headers.map((header, index) => (
          <Disclosure key={header} defaultOpen>
            <Disclosure.Button className="w-full">
              <GridHeader
                items={[header, ...headerItems]}
                needsRounding={index === 0}
              />
            </Disclosure.Button>
            <Disclosure.Panel>
              {rowsMap.get(header)?.map((item, index) => (
                <GridRow items={item} key={index} />
              ))}
            </Disclosure.Panel>
          </Disclosure>
        ))}
      </div>
    </div>
  );
}
