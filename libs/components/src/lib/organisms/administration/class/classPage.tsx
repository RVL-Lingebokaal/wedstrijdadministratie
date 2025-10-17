'use client';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Button, LoadingSpinner, SelectGender } from '@components/server';
import { Gender, getClassItem, WedstrijdIdProps } from '@models';
import { useCallback, useState } from 'react';
import {
  useGetClassMap,
  useGetGroups,
  useGetSettings,
  useGetTeams,
  useSaveSettings,
} from '@hooks';
import { ClassSection } from '../../../molecules/class-section/classSection';
import { ClassGridHeader } from '../../../atoms/grid-header/classGridHeader';
import { allAgesAreProcessed } from '@utils';
import toast from 'react-hot-toast';

interface ClassPageProps extends WedstrijdIdProps {
  isJeugdWedstrijd: boolean;
}

export function ClassPage({ wedstrijdId, isJeugdWedstrijd }: ClassPageProps) {
  const [gender, setGender] = useState<Gender>('male');
  const { data: teamData, isLoading } = useGetTeams(wedstrijdId);
  const { data: settingsData, refetch } = useGetSettings(wedstrijdId);
  const { mutate } = useSaveSettings({
    onSuccess: () =>
      toast.success('De wijzigingen in de klassen zijn opgeslagen!'),
    wedstrijdId,
  });

  const groups = useGetGroups(teamData ?? [], gender);
  const keys = Array.from(groups.keys()).sort();

  const classMap = useGetClassMap(settingsData);
  const { missing } = allAgesAreProcessed(
    teamData ?? [],
    settingsData?.classes ?? []
  );

  const addClassToAllTeams = useCallback(() => {
    teamData?.forEach(({ gender, boatType, ageClass }) => {
      const key = JSON.stringify({ gender, boat: boatType });
      const classItem = getClassItem({
        age: ageClass,
        boatType,
        gender,
        isJeugdWedstrijd,
      });
      if (classMap.has(key)) {
        const classItems = classMap.get(key) ?? [];
        if (classItems.length === 0) {
          classItems.push(classItem);
        } else {
          const found = classItems.find((c) => c.ages.includes(ageClass));
          if (!found) {
            classItems.push(classItem);
          }
        }
        classMap.set(key, classItems);
      } else {
        classMap.set(key, [classItem]);
      }
    });
    mutate({
      type: 'classes',
      itemsToSave: Array.from(classMap.values()).flat(),
    });
    void refetch();
  }, [teamData, classMap, isJeugdWedstrijd]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex justify-between items-center w-3/4">
        <SelectGender
          selectedValue={gender}
          onChange={(val: Gender) => setGender(val)}
          classNames="bg-white w-40 ml-1 border-primary py-2 px-4"
        />
        {missing > 0 && <h2>Nog niet alle teams zitten in een klasse.</h2>}
      </div>
      <div className="w-full">
        {keys.map((val, index) => {
          const classItems =
            classMap.get(JSON.stringify({ gender, boat: val })) ?? [];
          return (
            <Disclosure key={val}>
              <DisclosureButton className="w-3/4">
                <ClassGridHeader
                  boatType={val}
                  classItems={classItems}
                  needsRounding={index === 0}
                  teams={groups.get(val)}
                  ages={settingsData?.ages ?? []}
                />
              </DisclosureButton>
              <DisclosurePanel>
                <ClassSection
                  teams={groups.get(val) ?? []}
                  ages={settingsData?.ages ?? []}
                  boatType={val}
                  classes={settingsData?.classes ?? []}
                  gender={gender}
                  ownClassItems={classItems}
                  refetch={refetch}
                  wedstrijdId={wedstrijdId}
                />
              </DisclosurePanel>
            </Disclosure>
          );
        })}
      </div>
      <div className="ml-1 w-3/4 gap-6 mt-6 flex justify-between">
        <p>
          Gebruik deze knop om voor alle overige boten een klasse te maken. Er
          wordt per boottype, leeftijdsklasse en geslacht een nieuwe klasse
          aangemaakt.
        </p>
        <Button
          name="Maak klassen"
          color="primary"
          onClick={addClassToAllTeams}
          classNames="w-60 mr-1"
        />
      </div>
    </>
  );
}
