'use client';
import { useMemo } from 'react';
import { DateTime } from 'luxon';
import Person from '../../public/person.svg';
import Groups from '../../public/groups.svg';
import Rowing from '../../public/rowing.svg';
import Calendar from '../../public/calendar.svg';
import { GetCountsResponseDto } from '@models';
import { Block } from '../block/Block.client';
import Image from 'next/image';

interface WedstrijdHomeElementsProps {
  data: GetCountsResponseDto;
}

export function WedstrijdHomeElements({ data }: WedstrijdHomeElementsProps) {
  const elements = useMemo(() => {
    const currentDate = DateTime.now();
    const eventDate = DateTime.fromISO(data.date || '');
    const diff = eventDate.diff(currentDate, ['days']);

    return [
      {
        bottom: 'Deelnemers',
        title: data.participantsSize.toString() ?? '',
        icon: Person,
      },
      {
        bottom: 'Teams',
        title: data.teamsSize.toString() ?? '',
        icon: Groups,
      },
      {
        bottom: 'Verenigingen',
        title: data.clubsSize.toString() ?? '',
        icon: Rowing,
      },
      {
        bottom: 'Dagen',
        title: Math.ceil(diff.days).toString(),
        icon: Calendar,
      },
    ];
  }, [data?.clubsSize, data?.date, data?.participantsSize, data?.teamsSize]);

  return (
    <div className="flex flex-row gap-x-4 mt-48">
      {elements.map(({ title, bottom, icon }) => (
        <Block title={title} bottom={bottom} key={title} variant="small">
          <Image src={icon} alt={title} className="py-2" />
        </Block>
      ))}
    </div>
  );
}
