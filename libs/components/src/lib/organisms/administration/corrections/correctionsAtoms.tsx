import { FaExclamationTriangle } from 'react-icons/fa';
import { useCallback } from 'react';
import { Checkbox } from '../../../molecules/checkbox/checkbox';
import { useUpdateTimeChoice } from '@hooks';

interface CorrectionsTimeTextProps {
  showWarning?: boolean;
  text?: string | null;
  showUsingThis?: boolean;
}

export function CorrectionsTimeText({
  showWarning,
  text,
  showUsingThis,
}: CorrectionsTimeTextProps) {
  const textColor = showWarning
    ? 'text-orange-600'
    : showUsingThis
    ? 'text-green-600 font-bold'
    : '';

  return <span className={textColor}>{text ?? '-'}</span>;
}

interface CorrectionDifferenceIconProps {
  warning?: boolean;
  startNr: number;
  className: string;
}

export function CorrectionDifferenceIcon({
  warning,
  startNr,
  className,
}: CorrectionDifferenceIconProps) {
  const text = `${startNr} - ${className}`;
  if (warning) {
    return (
      <div className="flex gap-4">
        <FaExclamationTriangle className="fill-orange-600 h-6" />
        <span>{text}</span>
      </div>
    );
  }

  return text;
}

interface CorrectionActionsProps {
  id: string;
  wedstrijdId: string;
  useStartAInitial?: boolean;
  useFinishAInitial?: boolean;
  hasWarning?: boolean;
  processedInitial?: boolean;
}

export function CorrectionActions({
  id,
  wedstrijdId,
  useStartAInitial,
  useFinishAInitial,
  processedInitial,
  hasWarning,
}: CorrectionActionsProps) {
  const { mutate } = useUpdateTimeChoice({ wedstrijdId });

  const onChangeStart = useCallback(
    (value: boolean) => {
      mutate({ id, useStartA: value, useFinishA: useFinishAInitial !== false });
    },
    [id, useFinishAInitial]
  );
  const onChangeFinish = useCallback(
    (value: boolean) => {
      mutate({ id, useStartA: useStartAInitial !== false, useFinishA: value });
    },
    [id, useStartAInitial]
  );
  const onChangeProcessed = useCallback(
    (value: boolean) => {
      mutate({
        id,
        useStartA: useStartAInitial !== false,
        useFinishA: useFinishAInitial !== false,
        processed: value,
      });
    },
    [id, useFinishAInitial, useStartAInitial]
  );

  return (
    <div>
      <Checkbox
        label="Start A"
        enabled={useStartAInitial !== false}
        setEnabled={onChangeStart}
      />
      <Checkbox
        label="Finish A"
        enabled={useFinishAInitial !== false}
        setEnabled={onChangeFinish}
      />
      {(hasWarning || processedInitial !== undefined) && (
        <Checkbox
          enabled={processedInitial !== false}
          setEnabled={onChangeProcessed}
          label="Verwerkt"
        />
      )}
    </div>
  );
}
