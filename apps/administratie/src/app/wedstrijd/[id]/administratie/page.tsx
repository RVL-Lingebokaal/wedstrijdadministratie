'use client';

import { useState } from 'react';
import { AdministrationTabs, administrationTabsTranslated } from '@models';
import { Tabs } from '@components/server';
import {
  ClassPage,
  DownloadsPage,
  SessionPage,
  StartNumbersPage,
  StatisticsPage,
} from '@components';

export default function Administration({
  params: { id },
}: ParamsWithWedstrijdId) {
  const [tab, setTab] = useState<AdministrationTabs>('session');

  return (
    <div className="flex">
      <Tabs
        tabs={administrationTabsTranslated}
        currentTab={tab}
        setTab={setTab}
      />
      <div className="w-full">
        {tab === 'class' && <ClassPage wedstrijdId={id} />}
        {tab === 'session' && <SessionPage wedstrijdId={id} />}
        {tab === 'startNumbers' && <StartNumbersPage wedstrijdId={id} />}
        {tab === 'statistics' && <StatisticsPage wedstrijdId={id} />}
        {tab === 'downloads' && <DownloadsPage wedstrijdId={id} />}
      </div>
    </div>
  );
}
