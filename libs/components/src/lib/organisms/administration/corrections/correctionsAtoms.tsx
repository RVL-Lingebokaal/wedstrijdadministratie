import { FaExclamationTriangle } from 'react-icons/fa';
import { useCallback, useState } from 'react';
import { Checkbox } from '../../../molecules/checkbox/checkbox';
import { useUpdateTimeChoice } from '@hooks';

interface CorrectionsTimeTextProps {
  warning?: boolean;
  text?: string | null;
}

export function CorrectionsTimeText({
  warning,
  text,
}: CorrectionsTimeTextProps) {
  return (
    <span className={warning ? 'text-orange-600' : ''}>{text ?? '-'}</span>
  );
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
}

export function CorrectionActions({ id, wedstrijdId }: CorrectionActionsProps) {
  const { mutate } = useUpdateTimeChoice({ wedstrijdId });
  const [useStartA, setUseStartA] = useState(true);
  const [useFinishA, setUseFinishA] = useState(true);

  const onChangeStart = useCallback(
    (value: boolean) => {
      setUseStartA(value);
      mutate({ id, useStartA: value, useFinishA });
    },
    [id, useFinishA]
  );
  const onChangeFinish = useCallback(
    (value: boolean) => {
      setUseFinishA(value);
      mutate({ id, useStartA, useFinishA: value });
    },
    [id, useStartA]
  );

  return (
    <div>
      <Checkbox
        label="Start A"
        enabled={useStartA}
        setEnabled={onChangeStart}
      />
      <Checkbox
        label="Finish A"
        enabled={useFinishA}
        setEnabled={onChangeFinish}
      />
    </div>
  );
}
