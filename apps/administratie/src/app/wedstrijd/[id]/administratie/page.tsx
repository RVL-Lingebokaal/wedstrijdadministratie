'use client';

import { useState } from 'react';
import { AdministrationTabs, administrationTabsTranslated } from '@models';
import { LoadingSpinner, Tabs } from '@components/server';
import {
  ClassPage,
  DownloadsPage,
  SessionPage,
  StartNumbersPage,
  StatisticsPage,
} from '@components';
import { useGetGeneralSettings } from '@hooks';

export default function Administration({
  params: { id },
}: ParamsWithWedstrijdId) {
  const [tab, setTab] = useState<AdministrationTabs>('session');
  const { data, isLoading } = useGetGeneralSettings(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex">
      <Tabs
        tabs={administrationTabsTranslated}
        currentTab={tab}
        setTab={setTab}
      />
      <div className="w-full">
        {tab === 'class' && (
          <ClassPage
            wedstrijdId={id}
            isJeugdWedstrijd={data?.isJeugd ?? false}
          />
        )}
        {tab === 'session' && <SessionPage wedstrijdId={id} />}
        {tab === 'startNumbers' && <StartNumbersPage wedstrijdId={id} />}
        {tab === 'statistics' && <StatisticsPage wedstrijdId={id} />}
        {tab === 'downloads' && <DownloadsPage wedstrijdId={id} />}
      </div>
    </div>
  );
}
