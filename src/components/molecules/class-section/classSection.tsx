import { Team } from "../../../models/team";
import { AgeItem, AgeTypes } from "../../../models/settings";
import { getTeamsByClass } from "../../utils/teamUtils";
import { GridRow } from "../../atoms/grid-row/gridRow";

interface GlassSectionProps {
  teams: Team[];
  ages: AgeItem[];
}

export function ClassSection({ teams, ages }: GlassSectionProps) {
  const teamsByClass = getTeamsByClass(teams, ages);

  const keys = Array.from(teamsByClass.keys());
  const sortedKeys = keys.sort((a, b) => a.localeCompare(b));

  return (
    <div>
      {sortedKeys.map((val) => (
        <GridRow
          key={val}
          items={[
            { node: val },
            { node: "" + teamsByClass.get(val as AgeTypes)?.length },
            { node: "" },
          ]}
        />
      ))}
    </div>
  );
}
