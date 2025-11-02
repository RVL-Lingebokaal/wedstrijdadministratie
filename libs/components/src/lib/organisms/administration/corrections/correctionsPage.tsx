import { WedstrijdIdProps } from '@models';
import { GridHeader, GridRow, LoadingSpinner } from '@components/server';
import { useGetResultsForTeams } from '@hooks';
import { useMemo } from 'react';
import { getDifferenceResult } from '../../../utils/timeUtils';
import { convertTimeToObject } from '@utils';
import {
  CorrectionActions,
  CorrectionDifferenceIcon,
  CorrectionsTimeText,
} from './correctionsAtoms';

const headers = [
  'Nr + veld',
  'Ploeg',
  'Starttijd A',
  'Starttijd B',
  'Finishtijd A',
  'Finishtijd B',
  '',
];

export function CorrectionsPage({ wedstrijdId }: WedstrijdIdProps) {
  const { data, isLoading } = useGetResultsForTeams(wedstrijdId);

  const sortedData = useMemo(() => {
    if (!data) return [];

    const result = data.teamsResult.sort((a, b) => a.startNr - b.startNr);

    return result.map(({ startNr, result, className, name, id }) => {
      const { finishDifference, startDifference } = getDifferenceResult(result);
      const startTimeA = convertTimeToObject(result?.startTimeA?.toString());
      const startTimeB = convertTimeToObject(result?.startTimeB?.toString());
      const finishTimeA = convertTimeToObject(result?.finishTimeA?.toString());
      const finishTimeB = convertTimeToObject(result?.finishTimeB?.toString());

      let warningFinish = false;
      let warningStart = false;
      if (startDifference !== null && startDifference > 100) {
        warningStart = true;
      }
      if (finishDifference !== null && finishDifference > 1000) {
        warningFinish = true;
      }
      return [
        {
          node: (
            <CorrectionDifferenceIcon
              className={className}
              startNr={startNr}
              warning={warningFinish || warningStart}
            />
          ),
        },
        { node: name },
        {
          node: (
            <CorrectionsTimeText
              text={startTimeA.localeString}
              warning={warningStart}
            />
          ),
        },
        {
          node: (
            <CorrectionsTimeText
              text={startTimeB.localeString}
              warning={warningStart}
            />
          ),
        },
        {
          node: (
            <CorrectionsTimeText
              text={finishTimeA.localeString}
              warning={warningFinish}
            />
          ),
        },
        {
          node: (
            <CorrectionsTimeText
              text={finishTimeB.localeString}
              warning={warningFinish}
            />
          ),
        },
        { node: <CorrectionActions wedstrijdId={wedstrijdId} id={id} /> },
      ];
    });
  }, [JSON.stringify(data)]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <GridHeader items={headers} />
      {sortedData.map((item, index) => (
        <GridRow items={item} key={index} classNameItems="content-center" />
      ))}
    </div>
  );
}
