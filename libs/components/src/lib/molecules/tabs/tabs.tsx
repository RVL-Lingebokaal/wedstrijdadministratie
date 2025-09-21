import { Button } from '../../atoms/button/button';
import { AdministrationTabs, SettingsTabs } from '@models';
import { ResultsTabs } from '../../../../../../apps/administratie/src/app/results/results';

type PossibleTabs = AdministrationTabs | SettingsTabs | ResultsTabs;

interface TabsProps<T extends PossibleTabs> {
  tabs: T[];
  currentTab: T;
  setTab: (tab: T) => void;
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
          color={val === currentTab ? 'highlight' : 'primary'}
          onClick={() => setTab(val)}
        />
      ))}
    </div>
  );
}
