import { Button } from "../../atoms/button/button";
import { useSaveSettings } from "../../../hooks/useSaveSettings";
import { useRemoveClassItem } from "../../../hooks/useRemoveClassItem";
import { useCallback } from "react";
import { ClassItem } from "../../../models/settings";

interface RemoveGroupingButtonProps {
  group: ClassItem;
  classes: ClassItem[];
  updateClasses: (classes: ClassItem[]) => void;
}

export function RemoveGroupingButton({
  group,
  classes,
  updateClasses,
}: RemoveGroupingButtonProps) {
  const { mutate } = useRemoveClassItem();

  const onClick = useCallback(() => {
    console.log(group);
    mutate(group);
    const index = classes.findIndex(
      ({ gender, name, boatType }) =>
        gender === group.gender &&
        name === group.name &&
        boatType === group.boatType
    );
    updateClasses([...classes.splice(index, 1)]);
  }, [classes, group, mutate, updateClasses]);

  return (
    <Button
      onClick={onClick}
      classNames="mt-1"
      name="Verwijderen"
      color="highlightReverse"
    />
  );
}
