'use client';
import { Disclosure } from '@headlessui/react';
import { GridHeader, LoadingSpinner, SelectGender } from '@components/server';
import { ClassItem, Gender } from '@models';
import { getGroups } from '@utils';
import { useMemo, useState } from 'react';
import { useGetSettings, useGetTeams } from '@hooks';
import { ClassSection } from '../../../molecules/class-section/classSection';

export function ClassPage() {
  const [gender, setGender] = useState(Gender.M);
  const { data: teamData, isLoading } = useGetTeams();
  const { data: settingsData, refetch } = useGetSettings();

  const groups = useMemo(
    () => getGroups(teamData ?? [], gender),
    [gender, teamData]
  );
  const keys = Array.from(groups.keys()).sort();

  const classMap = useMemo(() => {
    const map = new Map<string, ClassItem[]>();
    if (settingsData?.classes === null || settingsData?.classes.length === 0) {
      return map;
    }
    return (
      settingsData?.classes.reduce((acc, c) => {
        const key = JSON.stringify({ gender: c.gender, boat: c.boatType });
        let arr: ClassItem[] = [];
        if (acc.has(key)) {
          arr = acc.get(key) ?? [];
        }
        arr.push(c);
        acc.set(key, arr);
        return acc;
      }, map) ?? map
    );
  }, [settingsData?.classes]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SelectGender
        selectedValue={gender}
        onChange={(val: Gender) => setGender(val)}
        classNames="bg-white w-40 ml-1 border-primary py-2 px-4"
      />
      <div className="w-full">
        {keys.map((val, index) => {
          const classItems =
            classMap.get(JSON.stringify({ gender, boat: val })) ?? [];
          return (
            <Disclosure key={val}>
              <Disclosure.Button className="w-3/4">
                <GridHeader
                  items={[
                    val,
                    `${groups.get(val)?.length ?? 0} inschrijvingen`,
                    `${classItems.length} ${
                      classItems.length === 1 ? 'groep' : 'groepen'
                    }`,
                  ]}
                  needsRounding={index === 0}
                />
              </Disclosure.Button>
              <Disclosure.Panel>
                <ClassSection
                  teams={groups.get(val) ?? []}
                  ages={settingsData?.ages ?? []}
                  boatType={val}
                  classes={settingsData?.classes ?? []}
                  gender={gender}
                  ownClassItems={classItems}
                  refetch={refetch}
                />
              </Disclosure.Panel>
            </Disclosure>
          );
        })}
      </div>
    </>
  );
}
