'use client';
import { useState } from 'react';
import { Tabs } from '@components/server';
import {
  ClassPage,
  SessionPage,
  StartNumbersPage,
  StatisticsPage,
} from '@components';

import { AdministrationTabs } from '@models';

export function AdministrationPage() {
  const [tab, setTab] = useState<AdministrationTabs[0]>(
    AdministrationTabs.session
  );

  return (
    <div className="flex">
      <Tabs
        tabs={Object.values(AdministrationTabs)}
        currentTab={tab}
        setTab={setTab}
      />
      <div className="w-full">
        {tab === AdministrationTabs.class && <ClassPage />}
        {tab === AdministrationTabs.session && <SessionPage />}
        {tab === AdministrationTabs.startNumbers && <StartNumbersPage />}
        {tab === AdministrationTabs.statistics && <StatisticsPage />}
      </div>
    </div>
  );
}
