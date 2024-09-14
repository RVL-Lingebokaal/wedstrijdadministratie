import { BoatType } from '@models';

interface SessionGridHeaderProps {
  block: number;
  totalTeams: number;
  teams: number;
  boatType: BoatType;
  isFirst?: boolean;
}

export function SessionGridHeader({
  block,
  totalTeams,
  teams,
  boatType,
  isFirst,
}: SessionGridHeaderProps) {
  return (
    <div
      className={`text-white text-lg grid m-1 text-left grid-cols-7 ${
        isFirst ? '' : 'mt-6'
      }`}
    >
      <div className="font-bold bg-secondary-500 py-3 px-4 rounded-tl-xl">{`Blok ${block}`}</div>
      <div className="bg-secondary-500 py-3 px-4">{boatType}</div>
      <div className="bg-secondary-500 py-3 px-4 col-span-2">{`Aantal teams: ${teams}`}</div>
      <div className="bg-secondary-500 py-3 px-4 rounded-tr-xl col-span-3">{`Totaal aantal teams: ${totalTeams}`}</div>
    </div>
  );
}
