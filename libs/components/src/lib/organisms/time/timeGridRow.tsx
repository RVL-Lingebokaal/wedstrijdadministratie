import { twMerge } from 'tailwind-merge';
import { DateTime } from 'luxon';
import { Time, WedstrijdIdProps } from '@models';
import { IconButton } from '@components/server';
import { FaClone, FaRedo, FaTrashAlt } from 'react-icons/fa';
import { useDeleteTime, useDuplicateTime, useRestoreTime } from '@hooks';

interface TimeGridRowProps extends WedstrijdIdProps {
  time: Time;
  teamId?: string;
  isA?: boolean;
  isStart?: boolean;
  text?: string;
  selectedTime: Time | null;
  setSelectedTime: (time: Time) => void;
  deleteFunc?: (time: Time) => void;
  hasDuplicate?: boolean;
  restoreFunc?: (time: Time) => void;
}

export function TimeGridRow({
  time,
  setSelectedTime,
  selectedTime,
  text,
  deleteFunc,
  hasDuplicate,
  restoreFunc,
  teamId,
  isA,
  isStart,
  wedstrijdId,
}: TimeGridRowProps) {
  const isSelected = selectedTime?.id === time.id;
  const hasDelete = deleteFunc !== undefined;
  const hasRestore = restoreFunc !== undefined;
  const { mutate: deleteTime } = useDeleteTime({ wedstrijdId });
  const { mutate: restoreTime } = useRestoreTime({ wedstrijdId });
  const { mutate: duplicateTime } = useDuplicateTime({ wedstrijdId });

  return (
    <div
      onClick={() => setSelectedTime(time)}
      className={twMerge(
        'bg-white px-4 py-2 rounded cursor-point',
        isSelected ? 'border-2 border-primary' : '',
        hasDelete || hasDuplicate || hasRestore
          ? 'flex justify-between items-center'
          : ''
      )}
    >
      <span>{`${DateTime.fromMillis(parseInt(time.time)).toISOTime({
        includeOffset: false,
        includePrefix: false,
      })}${text ? ` - ${text}` : ''}`}</span>
      <div className="flex gap-4">
        {hasDuplicate && isA !== undefined && isStart !== undefined && (
          <IconButton
            icon={<FaClone />}
            onClick={() => duplicateTime({ time: time.time, isA, isStart })}
          />
        )}
        {hasRestore && teamId && isA !== undefined && isStart !== undefined && (
          <IconButton
            icon={<FaRedo />}
            onClick={() => {
              void restoreTime({ ...time, teamId, isA, isStart });
              restoreFunc(time);
            }}
          />
        )}
        {hasDelete && (
          <IconButton
            icon={<FaTrashAlt />}
            onClick={() => {
              void deleteTime(time);
              deleteFunc(time);
            }}
          />
        )}
      </div>
    </div>
  );
}
