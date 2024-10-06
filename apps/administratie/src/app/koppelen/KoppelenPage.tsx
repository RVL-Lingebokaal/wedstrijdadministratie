'use client';
import { useState } from 'react';
import { StyledRadioGroup, TimePage } from '@components';
import { useGetTeams } from '@hooks';
import { LoadingSpinner } from '@components/server';

export function KoppelenPage() {
  const { data: teamData, isLoading: teamIsLoading } = useGetTeams();
  const [isA, setIsA] = useState(true);
  const [isStart, setIsStart] = useState(true);

  if (teamIsLoading) {
    return <LoadingSpinner />;
  }

  const noStartNumber = teamData?.some(
    (team) => team.startNumber === undefined
  );

  if (noStartNumber) {
    return (
      <h2>
        Er zijn nog teams die geen startnummer hebben. Ga naar de administratie
        pagina om alle teams een startnummer te geven.
      </h2>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="w-full pl-4">
        <StyledRadioGroup
          items={[
            { label: 'A', value: true },
            { label: 'B', value: false },
          ]}
          selected={isA}
          onChange={setIsA}
        />
        <StyledRadioGroup
          items={[
            { label: 'Start', value: true },
            { label: 'Finish', value: false },
          ]}
          selected={isStart}
          onChange={setIsStart}
        />
      </div>
      <TimePage teams={teamData ?? []} isA={isA} isStart={isStart} />
    </div>
  );
}
