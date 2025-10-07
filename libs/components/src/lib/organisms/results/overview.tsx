'use client';

import { useState } from 'react';
import { GridHeader, GridRow, Tabs } from '@components/server';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Item } from '@utils';

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
export const resultsTabs = ['uncorrected', 'corrected'] as const;
export type ResultsTabs = (typeof resultsTabs)[number];
export const resultsTabsWithTranslations: {
  value: ResultsTabs;
  name: string;
}[] = [
  { value: 'uncorrected', name: 'Origineel' },
  { value: 'corrected', name: 'Gecorrigeerd' },
];

interface OverviewResultsProps {
  headers: string[];
  rowsMap: Map<string, Item[][]>;
  correctedRows: Item[][];
}

export function OverviewResults({
  headers,
  rowsMap,
  correctedRows,
}: OverviewResultsProps) {
  const [tab, setTab] = useState<ResultsTabs>('uncorrected');

  return (
    <div className="flex w-full ">
      <Tabs
        tabs={resultsTabsWithTranslations}
        currentTab={tab}
        setTab={setTab}
      />
      <div className="w-full">
        {tab === 'uncorrected' &&
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
        {tab === 'corrected' && (
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
