'use client';
import { useGetResults } from '@hooks';
import { GridHeader, GridRow, LoadingSpinner } from '@components/server';
import { getConvertedResults } from '@utils';

const headerItems = ['Team', 'Start', 'Finish', 'Resultaat', 'Gecorrigeerd'];

export default function Results() {
  const { data, isLoading } = useGetResults();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const convertedData = getConvertedResults(data);

  return (
    <div className="flex w-full">
      <div className="w-full">
        <GridHeader items={headerItems} needsRounding />
        {convertedData?.map((item, index) => (
          <GridRow items={item} key={index} />
        ))}
      </div>
    </div>
  );
}
