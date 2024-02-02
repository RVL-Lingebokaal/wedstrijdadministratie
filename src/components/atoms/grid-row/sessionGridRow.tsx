import { Team } from "../../../models/team";
import { AgeItem } from "../../../models/settings";

interface SessionGridRowProps {
  team: Team;
  ageClasses: AgeItem[];
}

export function SessionGridRow({ team, ageClasses }: SessionGridRowProps) {
  return (
    <div className="grid grid-cols-12 m-1">
      <div className="bg-white py-3 px-4">{team.getAgeClass(ageClasses)}</div>
      <div className="bg-white py-3 px-4 col-span-2">{team.getClub()}</div>
      <div className="bg-white py-3 px-4 col-span-3">
        {team.getHelm()?.name ?? team.getParticipants()[0].name}
      </div>
      <div className="bg-white py-3 px-4 col-span-6 text-xs">
        {team.getRemarks()}
      </div>
    </div>
  );
}
