import { GridHeader } from '@components/server';
import { AgeItem, BoatType, ClassItem, Team } from '@models';
import { useIsGetFinishedRow } from '@hooks';

interface ClassGridHeaderProps {
  boatType: BoatType;
  teams?: Team[];
  classItems: ClassItem[];
  needsRounding?: boolean;
  ages: AgeItem[];
}

export function ClassGridHeader({
  boatType,
  teams,
  classItems,
  needsRounding,
  ages,
}: ClassGridHeaderProps) {
  const isFinished = useIsGetFinishedRow({
    teams: teams ?? [],
    classItems,
    ages,
  });

  return (
    <GridHeader
      items={[
        boatType,
        `${teams?.length ?? 0} inschrijvingen`,
        `${classItems.length} ${classItems.length === 1 ? 'groep' : 'groepen'}`,
      ]}
      needsRounding={needsRounding}
      color={isFinished ? 'success' : 'secondary'}
    />
  );
}
