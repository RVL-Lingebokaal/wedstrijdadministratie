import { useState } from "react";
import { TypesForm } from "../../components/organisms/settings/types/typesForm";
import { AgesForm } from "../../components/organisms/settings/age/ageForm";
import { useGetSettings } from "../../hooks/useGetSettings";
import { Tabs } from "../../components/molecules/tabs/tabs";
import {
  AgeItem,
  AgeStrategy,
  AgeType,
  BoatItem,
  BoatType,
} from "../../models/settings";
import { LoadingSpinner } from "../../components/atoms/loading-spinner/loadingSpinner";

export enum SettingsTabs {
  type = "Boottype",
  leeftijd = "Leeftijd",
  ploeg = "Ploeg",
  instellingen = "Instellingen",
  gebruikers = "Gebruikers",
}

export default function Settings() {
  const { data, isLoading } = useGetSettings();
  const [tab, setTab] = useState<SettingsTabs[0]>(SettingsTabs.type);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex">
      <Tabs
        tabs={Object.values(SettingsTabs)}
        currentTab={tab}
        setTab={setTab}
      />
      {tab === SettingsTabs.type && (
        <TypesForm
          initialValues={{
            items:
              data && data.boats.length > 0
                ? data.boats
                : getDefaultvaluesBoats(),
          }}
        />
      )}
      {tab === SettingsTabs.leeftijd && (
        <AgesForm
          initialValues={{
            items:
              data && data.ages.length > 0 ? data.ages : getDefaultvaluesAges(),
          }}
        />
      )}
    </div>
  );
}

const getDefaultvaluesBoats = (): BoatItem[] => {
  return Object.values(BoatType).map((key) => ({
    type: key,
    correction: 1,
    price: 10,
  }));
};

const getDefaultvaluesAges = (): AgeItem[] => {
  return Object.values(AgeType).map((key) => ({
    type: key,
    age: key,
    correctionFemale: 1,
    correctionMale: 1,
    strategy: AgeStrategy.average,
  }));
};
