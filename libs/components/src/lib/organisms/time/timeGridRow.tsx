import { twMerge } from 'tailwind-merge';
import { DateTime } from 'luxon';
import { Time } from '@models';
import { IconButton } from '@components/server';
import { FaTrashAlt } from 'react-icons/fa';
import { useDeleteTime } from '@hooks';

interface TimeGridRowProps {
  time: Time;
  text?: string;
  selectedTime: Time | null;
  setSelectedTime: (time: Time) => void;
  deleteFunc?: (time: Time) => void;
}

export function TimeGridRow({
  time,
  setSelectedTime,
  selectedTime,
  text,
  deleteFunc,
}: TimeGridRowProps) {
  const isSelected = selectedTime?.id === time.id;
  const hasDelete = deleteFunc !== undefined;
  const { mutate } = useDeleteTime();

  return (
    <div
      onClick={() => setSelectedTime(time)}
      className={twMerge(
        'bg-white px-4 py-2 rounded cursor-point',
        isSelected ? 'border-2 border-primary' : '',
        hasDelete ? 'flex justify-between items-center' : ''
      )}
    >
      <span>{`${DateTime.fromMillis(parseInt(time.time)).toISOTime({
        includeOffset: false,
        includePrefix: false,
      })}${text ? ` - ${text}` : ''}`}</span>
      {hasDelete && (
        <IconButton
          icon={<FaTrashAlt />}
          onClick={() => {
            void mutate(time);
            deleteFunc(time);
          }}
        />
      )}
    </div>
  );
}
