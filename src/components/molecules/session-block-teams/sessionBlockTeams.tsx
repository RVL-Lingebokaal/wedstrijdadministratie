import { AgeItem, BoatType } from "../../../models/settings";
import { Team } from "../../../models/team";
import { GridHeader } from "../../atoms/grid-header/gridHeader";
import { SessionGridHeader } from "../../atoms/grid-header/sessionGridHeader";
import { GridRow } from "../../atoms/grid-row/gridRow";
import { SessionGridRow } from "../../atoms/grid-row/sessionGridRow";

interface SessionBlockTeamsProps {
  teams?: Team[];
  block: number;
  boatType: BoatType;
  ageClasses: AgeItem[];
  totalTeams: number;
}

export function SessionBlockTeams({
  teams,
  block,
  ageClasses,
  boatType,
  totalTeams,
}: SessionBlockTeamsProps) {
  return (
    <>
      <SessionGridHeader
        block={block}
        totalTeams={totalTeams}
        teams={teams?.length ?? 0}
        boatType={boatType}
      />
      {teams?.map((team) => (
        <SessionGridRow
          key={team.getId()}
          team={team}
          ageClasses={ageClasses}
        />
      ))}
    </>
  );
}
