import { Tabs } from "../../components/molecules/tabs/tabs";
import { useState } from "react";
import ClassPage from "../../components/organisms/administration/class/classPage";
import { Select } from "../../components/molecules/select/select";
import { Gender } from "../../models/team";

export enum AdministrationTabs {
  class = "Klasseverdeling",
  session = "Sessie indeling",
}

export default function Administration() {
  const [tab, setTab] = useState<AdministrationTabs[0]>(
    AdministrationTabs.class
  );
  const [gender, setGender] = useState(Gender.M);

  return (
    <div className="flex">
      <Tabs
        tabs={Object.values(AdministrationTabs)}
        currentTab={tab}
        setTab={setTab}
      />

      <div>
        <Select
          items={Object.values(Gender).map(translateGender)}
          selectedValue={translateGender(gender)}
          onChange={(val: string) => setGender(getGender(val))}
          classNames="bg-white w-40 ml-1 border-primary py-2 px-4"
        />
        {tab === AdministrationTabs.class && <ClassPage gender={gender} />}
      </div>
    </div>
  );
}

function translateGender(gender: Gender) {
  switch (gender) {
    case Gender.M:
      return "Mannen";
    case Gender.F:
      return "Vrouwen";
    default:
      return "Mix";
  }
}

function getGender(val: string) {
  switch (val) {
    case "Mannen":
      return Gender.M;
    case "Vrouwen":
      return Gender.F;
    default:
      return Gender.MIX;
  }
}
