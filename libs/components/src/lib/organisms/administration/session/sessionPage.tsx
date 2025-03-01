'use client';
import { useMemo, useState } from 'react';
import { useGetSessionTotals, useGetTeams } from '@hooks';
import { LoadingSpinner, Select, SelectGender } from '@components/server';
import { BoatType, Gender } from '@models';
import { SessionBlockTeams } from '../../../molecules/session-block-teams/sessionBlockTeams';

export function SessionPage() {
  const [boatType, setBoatType] = useState<BoatType>(BoatType.scullTwoWithout);
  const [gender, setGender] = useState<Gender>(Gender.M);
  const { data: teamData, isLoading, refetch } = useGetTeams();
  const { totalBlocks, blockTeams, boatTypes } = useGetSessionTotals(teamData);

  const boatTypeSelectItems = useMemo(() => {
    return Array.from(boatTypes.values()).map((id) => ({ id }));
  }, [boatTypes]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex">
        <Select<string>
          items={boatTypeSelectItems}
          selectedValue={boatType}
          onChange={(val) => setBoatType(val as BoatType)}
          classNames="bg-white w-40 ml-1 border-primary py-2 px-4"
        />
        <SelectGender
          selectedValue={gender}
          onChange={(val) => setGender(val)}
          classNames="bg-white w-40 ml-1 border-primary py-2 px-4"
        />
      </div>
      <div className="w-full">
        <SessionBlockTeams
          blockKey={`${boatType}${gender}`}
          boatType={boatType}
          teams={teamData}
          refetch={refetch}
          totalBlocks={totalBlocks}
          blockTeams={blockTeams}
        />
      </div>
    </>
  );
}
