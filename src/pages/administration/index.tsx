import { Tabs } from "../../components/molecules/tabs/tabs";
import { useState } from "react";
import ClassPage from "../../components/organisms/administration/class/classPage";

export enum AdministrationTabs {
  session = "Sessie-indeling",
  class = "Klasseverdeling",
}

export default function Administration() {
  const [tab, setTab] = useState<AdministrationTabs[0]>(
    AdministrationTabs.class
  );

  return (
    <div className="flex">
      <Tabs
        tabs={Object.values(AdministrationTabs)}
        currentTab={tab}
        setTab={setTab}
      />
      {tab === AdministrationTabs.class && <ClassPage />}
    </div>
  );
}
