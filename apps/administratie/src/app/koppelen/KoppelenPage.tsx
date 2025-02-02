'use client';
import { useMemo, useState } from 'react';
import { StyledRadioGroup, TimePage } from '@components';
import { useGetTeams } from '@hooks';
import { LoadingSpinner } from '@components/server';

export enum Sessie {
  all = 'all',
  'sessie1' = 'sessie1',
  'sessie2' = 'sessie2',
  'sessie3' = 'sessie3',
}

export function KoppelenPage() {
  const { data: teamData, isLoading: teamIsLoading } = useGetTeams();
  const [isA, setIsA] = useState(true);
  const [isStart, setIsStart] = useState(true);
  const [sessie, setSessie] = useState<Sessie>(Sessie.all);

  const filteredTeams = useMemo(() => {
    if (!teamData) return [];

    if (sessie === Sessie.all) {
      return teamData;
    }
    const blockNumber = parseInt(sessie.replace('sessie', ''));

    return teamData.filter(
      (team) => team.block === blockNumber && !team.result
    );
  }, [sessie]);

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
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Koppelen</h1>
        <p>
          Begin met kiezen of je de A-tijden of de B-tijden wilt koppelen en of
          je bij de start of finish zit. Hierdoor worden alleen die tijden
          getoond. Je kan ook filteren op sessie nummer of er voor kiezen om
          alle tijden te zien.
        </p>
        <p>
          Kies uit de onderste lijst een tijd. Vul vervolgens een startnummer in
          de invoer in en druk op enter. De tijd is nu gekoppeld aan dit
          startnummer.
        </p>
      </div>
      <div className="pl-4 pt-4 grid grid-cols-1 w-2/5 gap-2">
        <StyledRadioGroup<boolean>
          items={[
            { label: 'A', value: true },
            { label: 'B', value: false },
          ]}
          selected={isA}
          onChange={setIsA}
        />
        <StyledRadioGroup<boolean>
          items={[
            { label: 'Start', value: true },
            { label: 'Finish', value: false },
          ]}
          selected={isStart}
          onChange={setIsStart}
        />
      </div>
      <div className="pl-4 pt-4 grid grid-cols-1 w-3/5 gap-2">
        <StyledRadioGroup<Sessie>
          items={[
            { label: 'Alle sessies', value: Sessie.all },
            { label: 'Sessie 1', value: Sessie.sessie1 },
            { label: 'Sessie 2', value: Sessie.sessie2 },
            { label: 'Sessie 3', value: Sessie.sessie3 },
          ]}
          selected={sessie}
          onChange={setSessie}
        />
      </div>
      <TimePage teams={filteredTeams} isA={isA} isStart={isStart} />
    </div>
  );
}
