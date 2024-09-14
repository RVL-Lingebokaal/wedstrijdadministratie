'use client';
import { useGetTeams } from '@hooks';
import { LoadingSpinner } from '@components/server';
import { TeamAddButton, TeamUpdateButton } from '@components';

export function DataPage() {
  const { data, isLoading, refetch } = useGetTeams();

  if (isLoading || !data) {
    return (
      <div>
        <h1 className="font-bold text-2xl text-primary">Data</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-bold text-2xl mb-3 text-primary">Data</h1>
      <h2 className="font-bold text-xl mb-2">Ploegen</h2>
      <p className="mb-2">
        Er zijn op dit moment {data.length} teams ingeschreven.
      </p>
      <div className="flex gap-3">
        <TeamAddButton refetch={refetch} />
        <TeamUpdateButton refetch={refetch} teams={data} />
      </div>
    </div>
  );
}
