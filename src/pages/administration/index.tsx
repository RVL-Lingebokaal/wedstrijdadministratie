import { Tabs } from "../../components/molecules/tabs/tabs";
import { useState } from "react";
import ClassPage from "../../components/organisms/administration/class/classPage";
import { Select } from "../../components/atoms/select/select";
import { Gender } from "../../models/team";
import SelectGender from "../../components/atoms/select/selectGender";

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
        <SelectGender
          selectedValue={gender}
          onChange={(val: Gender) => setGender(val)}
          classNames="bg-white w-40 ml-1 border-primary py-2 px-4"
        />
        {tab === AdministrationTabs.class && <ClassPage gender={gender} />}
      </div>
    </div>
  );
}
