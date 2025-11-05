'use client';
import { TeamAddButton, TeamUpdateButton } from '@components';
import { useGetTeams } from '@hooks';
import { LoadingSpinner } from '@components/server';

export default function Page({ params: { id } }: ParamsWithWedstrijdId) {
  const { data: teams, isLoading } = useGetTeams(id);

  return (
    <div>
      <h1 className="font-bold text-2xl mb-3 text-primary">Data</h1>
      <h2 className="font-bold text-xl mb-2">Ploegen</h2>
      <p className="mb-2">
        Er zijn op dit moment {teams?.length} teams ingeschreven.
      </p>
      <div className="flex gap-3">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <TeamAddButton wedstrijdId={id} />
            <TeamUpdateButton teams={teams ?? []} wedstrijdId={id} />
          </>
        )}
      </div>
    </div>
  );
}
