'use client';
import { useState } from 'react';
import { AgesForm, BoatsForm, SettingsForm } from '@components';
import { LoadingSpinner, Tabs } from '@components/server';
import {
  AgeItem,
  ageTypes,
  BoatItem,
  boatTypes,
  SettingsTabs,
  settingsTabsTranslated,
} from '@models';
import { useGetGeneralSettings, useGetSettings } from '@hooks';

export default function SettingsPage({
  params: { id },
}: ParamsWithWedstrijdId) {
  const { data, isLoading } = useGetSettings(id);
  const { data: generalData, isLoading: generalIsLoading } =
    useGetGeneralSettings(id);
  const [tab, setTab] = useState<SettingsTabs>('type');

  if (isLoading || generalIsLoading) {
    return <LoadingSpinner />;
  }

  if (!data || !generalData) {
    return <h2>Er is geen data gevonden. Probeer het later nog een keer.</h2>;
  }

  return (
    <div className="flex">
      <Tabs tabs={settingsTabsTranslated} currentTab={tab} setTab={setTab} />
      {tab === 'type' && (
        <BoatsForm
          wedstrijdId={id}
          initialValues={{
            items:
              data && data.boats && data.boats.length > 0
                ? data.boats
                : getDefaultvaluesBoats(),
          }}
        />
      )}
      {tab === 'leeftijd' && (
        <AgesForm
          wedstrijdId={id}
          initialValues={{
            items:
              data && data.ages && data.ages.length > 0
                ? data.ages
                : getDefaultvaluesAges(),
          }}
        />
      )}
      {tab === 'instellingen' && (
        <SettingsForm
          wedstrijdId={id}
          initialData={{
            date: generalData.date,
            missingNumbers: generalData.missingNumbers ?? [],
          }}
        />
      )}
    </div>
  );
}

const getDefaultvaluesBoats = (): BoatItem[] => {
  return boatTypes.map((key) => ({
    type: key,
    correction: 1,
    price: 10,
  }));
};

const getDefaultvaluesAges = (): AgeItem[] => {
  return ageTypes.map((key) => ({
    type: key,
    age: key,
    correctionFemale: 1,
    correctionMale: 1,
    strategy: 'gemiddeld',
  }));
};
