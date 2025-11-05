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
import { CorrectionsUpdateChoiceForAll } from './correctionsUpdateChoiceForAll';

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
      const useStartA =
        result?.useStartA === undefined ? true : result?.useStartA;
      const useFinishA =
        result?.useFinishA === undefined ? true : result?.useFinishA;
      const { finishDifference, startDifference } = getDifferenceResult(result);
      const startTimeA = convertTimeToObject(result?.startTimeA);
      const startTimeB = convertTimeToObject(result?.startTimeB);
      const finishTimeA = convertTimeToObject(result?.finishTimeA);
      const finishTimeB = convertTimeToObject(result?.finishTimeB);
      const processed = result?.processed;

      let warningFinish = false;
      let warningStart = false;
      if (startDifference !== null && startDifference > 1000) {
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
              warning={
                processed === true ? false : warningFinish || warningStart
              }
            />
          ),
        },
        { node: name },
        {
          node: (
            <CorrectionsTimeText
              text={startTimeA.localeString}
              showWarning={processed === true ? false : warningStart}
              showUsingThis={Boolean(
                (startTimeA.localeString && useStartA) ||
                  (startTimeA && startTimeB.localeString === null)
              )}
            />
          ),
        },
        {
          node: (
            <CorrectionsTimeText
              text={startTimeB.localeString}
              showWarning={processed === true ? false : warningStart}
              showUsingThis={Boolean(
                (startTimeB.localeString && !useStartA) ||
                  (startTimeB && startTimeA.localeString === null)
              )}
            />
          ),
        },
        {
          node: (
            <CorrectionsTimeText
              text={finishTimeA.localeString}
              showWarning={processed == true ? false : warningFinish}
              showUsingThis={Boolean(
                (finishTimeA.localeString && useFinishA) ||
                  (finishTimeA && finishTimeB.localeString === null)
              )}
            />
          ),
        },
        {
          node: (
            <CorrectionsTimeText
              text={finishTimeB.localeString}
              showWarning={processed == true ? false : warningFinish}
              showUsingThis={Boolean(
                (finishTimeB.localeString && !useFinishA) ||
                  (finishTimeB && finishTimeA.localeString === null)
              )}
            />
          ),
        },
        {
          node: (
            <CorrectionActions
              wedstrijdId={wedstrijdId}
              id={id}
              useStartAInitial={result?.useStartA}
              useFinishAInitial={result?.useFinishA}
              hasWarning={warningFinish || warningStart}
              processedInitial={result?.processed}
            />
          ),
        },
      ];
    });
  }, [JSON.stringify(data)]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div>
        <CorrectionsUpdateChoiceForAll wedstrijdId={wedstrijdId} />
      </div>

      <GridHeader items={headers} />
      {sortedData.map((item, index) => (
        <GridRow items={item} key={index} classNameItems="content-center" />
      ))}
    </div>
  );
}
