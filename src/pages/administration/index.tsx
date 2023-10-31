import { Tabs } from "../../components/molecules/tabs/tabs";
import { useState } from "react";
import ClassPage from "../../components/organisms/administration/class/classPage";
import StartListPage from "../../components/organisms/administration/start-list/startListPage";
import SessionPage from "../../components/organisms/administration/session/sessionPage";

export enum AdministrationTabs {
  class = "Klasseverdeling",
  session = "Sessie indeling",
  startList = "Start lijst",
}

export default function Administration() {
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
        {tab === AdministrationTabs.startList && <StartListPage />}
      </div>
    </div>
  );
}
