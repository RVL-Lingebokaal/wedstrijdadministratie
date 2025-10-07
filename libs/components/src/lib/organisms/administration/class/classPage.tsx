'use client';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { LoadingSpinner, SelectGender } from '@components/server';
import { Gender, WedstrijdIdProps } from '@models';
import { useState } from 'react';
import {
  useGetClassMap,
  useGetGroups,
  useGetSettings,
  useGetTeams,
} from '@hooks';
import { ClassSection } from '../../../molecules/class-section/classSection';
import { ClassGridHeader } from '../../../atoms/grid-header/classGridHeader';
import { allAgesAreProcessed } from '@utils';

export function ClassPage({ wedstrijdId }: WedstrijdIdProps) {
  const [gender, setGender] = useState<Gender>('male');
  const { data: teamData, isLoading } = useGetTeams(wedstrijdId);
  const { data: settingsData, refetch } = useGetSettings(wedstrijdId);

  const groups = useGetGroups(teamData ?? [], gender);
  const keys = Array.from(groups.keys()).sort();

  const classMap = useGetClassMap(settingsData);
  const { missing } = allAgesAreProcessed(
    teamData ?? [],
    settingsData?.classes ?? []
  );

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
    </>
  );
}
