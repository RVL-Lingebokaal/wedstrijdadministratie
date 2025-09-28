import { useCallback, useEffect, useMemo, useState } from 'react';
import { StartNumberTime, Team, Time } from '@models';
import { useInitiateUpdates, useSaveTime } from '@hooks';
import {
  getNewTimes,
  getPossibleStartNumbers,
  onClickKoppel,
} from '../../utils/timeUtils';
import { Combobox } from '@components';
import { Button } from '@components/server';
import { TimeGridRow } from './timeGridRow';

interface TimePageProps {
  teams: Team[];
  isA: boolean;
  isStart: boolean;
}

export function TimePage({ teams, isStart, isA }: TimePageProps) {
  const { mutate } = useSaveTime();
  const [selected, setSelected] = useState('');
  const [times, setTimes] = useState<Time[]>([]);
  const [startNumberTimes, setStartNumberTimes] = useState<StartNumberTime[]>(
    []
  );
  const [selectedTime, setSelectedTime] = useState<Time | null>(times[0]);

  useEffect(() => {
    setSelected('');
    setTimes([]);
    setStartNumberTimes([]);
    setSelectedTime(null);
  }, [isA, isStart]);

  const updateTimes = useCallback(
    (newTimes: Time[]) =>
      setTimes((prevState) => {
        const t = getNewTimes(prevState, newTimes);
        setSelectedTime(t[0]);
        return t;
      }),
    []
  );

  const possibleStartNumbers = useMemo(
    () =>
      getPossibleStartNumbers(teams, isA, isStart).map((number) => ({
        label: number,
        value: number,
      })),
    [teams]
  );

  useInitiateUpdates(updateTimes, isA, isStart);

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 py-4 gap-6">
        <div className="grid grid-cols-2 gap-6 col-span-2">
          <Combobox
            values={possibleStartNumbers ?? []}
            selectedItem={{ label: selected, value: selected }}
            setSelectedItem={(val) => setSelected(val?.value ?? '')}
          />
          <div>
            <Button
              name="Koppel"
              color="primary"
              onClick={() =>
                onClickKoppel({
                  selectedTime,
                  selected,
                  setStartNumberTimes,
                  setTimes,
                  setSelected,
                  setSelectedTime,
                  teams,
                  mutate,
                  isA,
                  isStart,
                })
              }
              classNames="h-max py-1 px-4 w-full"
            />
            <div className="grid gap-1 pt-6">
              {startNumberTimes.map((item) => (
                <TimeGridRow
                  key={item.id}
                  time={item}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  text={`${item.startNumber} - ${item.club}`}
                  isA={isA}
                  isStart={isStart}
                  teamId={item.teamId}
                  restoreFunc={(time) =>
                    setStartNumberTimes((prev) =>
                      prev.filter((startTime) => time.id !== startTime.id)
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-1">
          {times.map((time) => (
            <TimeGridRow
              key={time.id}
              time={time}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              isStart={isStart}
              isA={isA}
              deleteFunc={(time) => {
                setTimes((prevState) => {
                  const filtered = prevState.filter((t) => t.id !== time.id);
                  setSelectedTime(filtered[0] ?? null);
                  return filtered;
                });
              }}
              hasDuplicate
            />
          ))}
        </div>
      </div>
    </div>
  );
}
