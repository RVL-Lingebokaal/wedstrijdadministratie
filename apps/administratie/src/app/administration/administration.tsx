'use client';
import { useState } from 'react';
import { Tabs } from '@components/server';
import {
  ClassPage,
  DownloadsPage,
  SessionPage,
  StartNumbersPage,
  StatisticsPage,
} from '@components';

import { administrationTabs, AdministrationTabs } from '@models';

export function AdministrationPage() {
  const [tab, setTab] = useState<AdministrationTabs>('session');

  return (
    <div className="flex">
      <Tabs tabs={[...administrationTabs]} currentTab={tab} setTab={setTab} />
      <div className="w-full">
        {tab === 'class' && <ClassPage />}
        {tab === 'session' && <SessionPage />}
        {tab === 'startNumbers' && <StartNumbersPage />}
        {tab === 'statistics' && <StatisticsPage />}
        {tab === 'downloads' && <DownloadsPage />}
      </div>
    </div>
  );
}
