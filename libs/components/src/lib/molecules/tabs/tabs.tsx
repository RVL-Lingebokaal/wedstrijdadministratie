import { Button } from '../../atoms/button/button';
import { AdministrationTabs, SettingsTabs } from '@models';
import { ResultsTabs } from '../../organisms/results/overview';

type PossibleTabs = AdministrationTabs | SettingsTabs | ResultsTabs;

interface TabsProps<T extends PossibleTabs> {
  tabs: { name: string; value: T }[];
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
      {tabs.map(({ name, value }) => (
        <Button
          key={value}
          name={name}
          color={value === currentTab ? 'highlight' : 'primary'}
          onClick={() => setTab(value)}
        />
      ))}
    </div>
  );
}
