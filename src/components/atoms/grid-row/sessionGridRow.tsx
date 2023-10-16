import { Team } from "../../../models/team";
import { AgeItem } from "../../../models/settings";

interface SessionGridRowProps {
  team: Team;
  ageClasses: AgeItem[];
}

export function SessionGridRow({ team, ageClasses }: SessionGridRowProps) {
  return (
    <div className="grid grid-cols-7 m-1">
      <div className="bg-white py-3 px-4">{team.getAgeClass(ageClasses)}</div>
      <div className="bg-white py-3 px-4 col-span-2">{team.getClub()}</div>
      <div className="bg-white py-3 px-4 col-span-4">
        {team.getHelm()?.getName() ?? team.getParticipants()[0].getName()}
      </div>
    </div>
  );
}
