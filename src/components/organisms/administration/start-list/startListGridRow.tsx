import { Team } from "../../../../models/team";
import { AgeItem } from "../../../../models/settings";
import { GridRow } from "../../../atoms/grid-row/gridRow";

interface StartListGridRowProps {
  team: Team;
  startNumber: number;
  ageItems: AgeItem[];
  needsPaddingTop: boolean;
}

export function StartListGridRow({
  team,
  startNumber,
  ageItems,
  needsPaddingTop,
}: StartListGridRowProps) {
  const helm = team.getHelm()?.getName() ?? team.getParticipants()[0].getName();

  return (
    <GridRow
      classNames={needsPaddingTop ? "mt-4" : undefined}
      itemsCount={10}
      items={[
        { node: startNumber },
        { node: team.getBlock() },
        { node: team.getField(ageItems) },
        { node: team.getName(), classNames: "col-span-2" },
        { node: helm, classNames: "col-span-2" },
        { node: team.getBoat()?.getName(), classNames: "col-span-2" },
        { node: team.getId() },
      ]}
    />
  );
}
