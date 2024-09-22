import { AgeItem, getAgeClassTeam, Team } from '@models';

interface SessionGridRowProps {
  team: Team;
  ageClasses: AgeItem[];
}

export function SessionGridRow({ team, ageClasses }: SessionGridRowProps) {
  return (
    <div className="grid grid-cols-12 m-1">
      <div className="bg-white py-3 px-4">
        {getAgeClassTeam({ ages: ageClasses, participants: team.participants })}
      </div>
      <div className="bg-white py-3 px-4 col-span-2">{team.club}</div>
      <div className="bg-white py-3 px-4 col-span-3">
        {team.helm?.name ?? team.participants[0].name}
      </div>
      <div className="bg-white py-3 px-4 col-span-6 text-xs">
        {team.remarks}
      </div>
    </div>
  );
}
