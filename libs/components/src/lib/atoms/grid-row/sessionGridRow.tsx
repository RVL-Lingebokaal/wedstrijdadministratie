import { Team } from '@models';

interface SessionGridRowProps {
  team: Team;
}

export function SessionGridRow({ team }: SessionGridRowProps) {
  return (
    <div className="grid grid-cols-12 m-1">
      <div className="bg-white py-3 px-4">{team.ageClass}</div>
      <div className="bg-white py-3 px-4 col-span-2">{team.name}</div>
      <div className="bg-white py-3 px-4 col-span-3">
        {team.participants[0].name}
      </div>
      <div className="bg-white py-3 px-4 col-span-6 text-xs">
        {team.remarks}
      </div>
    </div>
  );
}
