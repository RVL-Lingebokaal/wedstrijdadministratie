import { Button } from "../../components/atoms/button/button";
import { useState } from "react";
import { TypesForm } from "../../components/organisms/settings/types/typesForm";
import { AgesForm } from "../../components/organisms/settings/age/ageForm";
import { useGetSettings } from "../../hooks/useGetSettings";
import { FaSpinner } from "react-icons/fa";
import { Tabs } from "../../components/molecules/tabs/tabs";

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

  if (isLoading || !data) {
    return <FaSpinner className="animate-spin text-brand-blue-500" />;
  }

  return (
    <div className="flex">
      <Tabs
        tabs={Object.values(SettingsTabs)}
        currentTab={tab}
        setTab={setTab}
      />
      {tab === SettingsTabs.type && (
        <TypesForm initialValues={{ items: data.boats }} />
      )}
      {tab === SettingsTabs.leeftijd && (
        <AgesForm initialValues={{ items: data.ages }} />
      )}
    </div>
  );
}
