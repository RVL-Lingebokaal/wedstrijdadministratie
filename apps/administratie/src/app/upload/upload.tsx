'use client';
import { useGetCounts } from '@hooks';
import { LoadingSpinner } from '@components/server';
import { UploadButton } from '@components';

export function UploadPage() {
  const { data, isLoading } = useGetCounts();

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-primary mb-2">Upload</h1>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <p>{`Er zijn op dit moment ${data?.teamsSize} teams en ${data?.participantsSize} deelnemers ingeschreven.`}</p>
            <p className="mt-5 w-3/5">
              Upload hier het csv bestand van de bond. Alle data van teams,
              deelnemers en sessie indelingen zal worden verwijderd. De
              instellingen zoals correctiefactoren en klasse indelingen zullen
              wel blijven bestaan.
            </p>
          </>
        )}
      </div>
      <UploadButton />
    </div>
  );
}
