import { SettingsTabs } from "../../../pages/settings";
import { Button } from "../../atoms/button/button";
import { AdministrationTabs } from "../../../pages/administration";

type PossibleTabs = AdministrationTabs | SettingsTabs;

interface TabsProps<T extends PossibleTabs> {
  tabs: string[];
  currentTab: T[0];
  setTab: (tab: T[0]) => void;
}

export function Tabs<T extends PossibleTabs>({
  tabs,
  currentTab,
  setTab,
}: TabsProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      {tabs.map((val) => (
        <Button
          key={val}
          name={val}
          color={val === currentTab ? "highlight" : "primary"}
          onClick={() => setTab(val)}
        />
      ))}
    </div>
  );
}
