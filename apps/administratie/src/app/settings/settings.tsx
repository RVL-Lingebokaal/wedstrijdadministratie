'use client';
import { useState } from 'react';
import { AgesForm, BoatsForm, SettingsForm } from '@components';
import { LoadingSpinner, Tabs } from '@components/server';
import {
  AgeItem,
  ageTypes,
  BoatItem,
  boatTypes,
  settingsTabs,
  SettingsTabs,
} from '@models';
import { useGetGeneralSettings, useGetSettings } from '@hooks';

export default function SettingsPage() {
  const { data, isLoading } = useGetSettings();
  const { data: generalData, isLoading: generalIsLoading } =
    useGetGeneralSettings();
  const [tab, setTab] = useState<SettingsTabs>('type');

  if (isLoading || generalIsLoading) {
    return <LoadingSpinner />;
  }

  if (!data || !generalData) {
    return <h2>Er is geen data gevonden. Probeer het later nog een keer.</h2>;
  }

  return (
    <div className="flex">
      <Tabs tabs={[...settingsTabs]} currentTab={tab} setTab={setTab} />
      {tab === 'type' && (
        <BoatsForm
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
