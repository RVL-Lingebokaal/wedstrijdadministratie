'use client';
import { GetCountsResponseDto } from '@models';
import { useGetCounts } from '@hooks';

interface UploadDataProps {
  initialDataCounts: GetCountsResponseDto;
  wedstrijdId: string;
}

export function UploadData({
  initialDataCounts,
  wedstrijdId,
}: UploadDataProps) {
  const { data: countsData, isLoading: isCountsLoading } = useGetCounts(
    wedstrijdId,
    initialDataCounts
  );

  if (isCountsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <p>{`Er zijn op dit moment ${countsData.teamsSize} teams en ${countsData.participantsSize} deelnemers ingeschreven.`}</p>
  );
}
