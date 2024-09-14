'use client';
import { useState } from 'react';
import { Tabs } from '@components/server';
import { ClassPage, SessionPage } from '@components';

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

      <div>
        {tab === AdministrationTabs.class && <ClassPage />}
        {tab === AdministrationTabs.session && <SessionPage />}
      </div>
    </div>
  );
}
