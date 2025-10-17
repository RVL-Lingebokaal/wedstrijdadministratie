'use client';
import { useMemo, useState } from 'react';
import { StyledRadioGroup, TimePage } from '@components';
import { useGetTeams } from '@hooks';
import { LoadingSpinner } from '@components/server';
import { Sessie } from '@models';

export default function KoppelenPage({
  params: { id },
}: ParamsWithWedstrijdId) {
  const { data: teamData, isLoading: teamIsLoading } = useGetTeams(id);
  const [isA, setIsA] = useState(true);
  const [isStart, setIsStart] = useState(true);
  const [sessie, setSessie] = useState<Sessie>('all');

  const filteredTeams = useMemo(() => {
    if (!teamData) return [];

    if (sessie === 'all') {
      return teamData;
    }
    const blockNumber = parseInt(sessie.replace('sessie', ''));

    return teamData.filter(
      (team) => team.block === blockNumber && !team.result
    );
  }, [sessie, JSON.stringify(teamData)]);

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
            { label: 'Alle sessies', value: 'all' },
            { label: 'Sessie 1', value: 'sessie1' },
            { label: 'Sessie 2', value: 'sessie2' },
            { label: 'Sessie 3', value: 'sessie3' },
          ]}
          selected={sessie}
          onChange={setSessie}
        />
      </div>
      <p className="mt-8">
        Kies uit de onderste lijst een tijd. Vul vervolgens een startnummer in
        de invoer in en druk op enter. De tijd is nu gekoppeld aan dit
        startnummer.
      </p>
      <TimePage
        teams={filteredTeams}
        isA={isA}
        isStart={isStart}
        wedstrijdId={id}
      />
    </div>
  );
}
