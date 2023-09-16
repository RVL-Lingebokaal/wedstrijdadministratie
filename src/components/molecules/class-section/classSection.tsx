import { Gender, Team } from "../../../models/team";
import {
  AgeItem,
  AgeType,
  BoatType,
  ClassItem,
} from "../../../models/settings";
import { getTeamsByClass } from "../../utils/teamUtils";
import { useCallback, useMemo, useState } from "react";
import { ClassRow } from "../../atoms/class-row/classRow";
import { GroupingButton } from "../grouping-button/groupingButton";
import { useSaveSettings } from "../../../hooks/useSaveSettings";
import { RemoveGroupingButton } from "../remove-grouping-button/removeGroupingButton";

interface ClassSectionProps {
  teams: Team[];
  ages: AgeItem[];
  boatType: BoatType;
  classes: ClassItem[];
  gender: Gender;
  ownClassItems: ClassItem[];
  refetch: () => void;
}

export function ClassSection({
  teams,
  ages,
  boatType,
  classes,
  gender,
  ownClassItems,
  refetch,
}: ClassSectionProps) {
  const { mutate } = useSaveSettings();
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(
    new Set()
  );
  const teamsByClass = getTeamsByClass(teams, ages);

  const keys = Array.from(teamsByClass.keys());
  const sortedKeys = keys.sort((a, b) => a.localeCompare(b));
  const lowestIndex = useMemo(() => {
    let index: number | undefined;
    selectedIndexes.forEach((val) => {
      if (index === undefined || val < index) {
        index = val;
      }
    });
    return index;
  }, [selectedIndexes]);

  const onClickBoat = useCallback((val: number) => {
    setSelectedIndexes((prev) => {
      const newSet = new Set(prev.values());
      newSet.has(val) ? newSet.delete(val) : newSet.add(val);
      return newSet;
    });
  }, []);

  const onSaveName = useCallback(
    (name: string) => {
      const classItem: ClassItem = {
        name,
        boatType,
        gender,
        ages: Array.from(selectedIndexes.values())
          .reduce<AgeType[]>((acc, val) => {
            acc.push(sortedKeys[val]);
            return acc;
          }, [])
          .sort(),
      };
      classes.push(classItem);
      mutate({ type: "classes", items: classes });
      setSelectedIndexes(new Set());
      refetch();
    },
    [boatType, classes, gender, mutate, refetch, selectedIndexes, sortedKeys]
  );

  return (
    <div>
      {sortedKeys.map((val, index) => {
        const group = ownClassItems.find(({ ages }) => ages.includes(val));
        const classIndex = group?.ages.findIndex((a) => a === val);
        const border = getBorder({ index: classIndex, ages: group?.ages });
        return (
          <div className="flex" key={index}>
            <ClassRow
              selected={selectedIndexes.has(index)}
              border={border}
              onClick={() => onClickBoat(index)}
              disabled={!!group}
              items={[
                { text: val },
                {
                  text: "" + teamsByClass.get(val)?.length,
                  key: `${val}-${teamsByClass.get(val)?.length}`,
                },
                {
                  text: group ? group.name : "",
                  key: `${val}-${
                    group?.name.toLowerCase() ?? val.toLowerCase()
                  }`,
                },
              ]}
            />
            {selectedIndexes.size >= 0 && lowestIndex === index && (
              <GroupingButton
                selectedIndexes={selectedIndexes}
                onSaveName={onSaveName}
              />
            )}
            {group && classIndex === 0 && (
              <RemoveGroupingButton
                group={group}
                classes={classes}
                refetch={refetch}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function getBorder({ index, ages }: { index?: number; ages?: AgeType[] }) {
  const basicBorder = { right: true, left: true };
  if (index === undefined || !ages) {
    return undefined;
  }
  if (ages.length === 1) {
    return { top: true, bottom: true, ...basicBorder };
  }
  if (index === 0) {
    return { top: true, ...basicBorder };
  }
  if (index === ages.length - 1) {
    return { bottom: true, ...basicBorder };
  }
  return basicBorder;
}
