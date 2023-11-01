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
  const classNames = team.getIsDisabled() ? "line-through" : "";

  return (
    <GridRow
      classNames={needsPaddingTop ? "mt-4" : undefined}
      itemsCount={9}
      items={[
        { node: startNumber, classNames },
        { node: team.getBlock(), classNames },
        { node: team.getField(ageItems), classNames },
        { node: team.getName(), classNames: `col-span-2 ${classNames}` },
        { node: helm, classNames: `col-span-2 ${classNames}` },
        {
          node: team.getBoat()?.getName(),
          classNames: `col-span-2 ${classNames}`,
        },
      ]}
    />
  );
}
