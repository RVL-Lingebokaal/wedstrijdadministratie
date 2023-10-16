import { useMemo, useState } from "react";
import { useGetTeams } from "../../../../hooks/teams/useGetTeams";
import { useGetSettings } from "../../../../hooks/settings/useGetSettings";
import { LoadingSpinner } from "../../../atoms/loading-spinner/loadingSpinner";
import { Select } from "../../../atoms/select/select";
import { BoatType } from "../../../../models/settings";
import { SessionBlockTeams } from "../../../molecules/session-block-teams/sessionBlockTeams";

export default function SessionPage() {
  const [boatType, setBoatType] = useState<BoatType>(BoatType.skiff);
  const { data: teamData, isLoading, refetch } = useGetTeams();
  const { data: settingsData } = useGetSettings();

  console.log({ teamData, isLoading });

  const ageClasses = settingsData?.ages ?? [];

  const boatTypeSelectItems = useMemo(() => {
    return Array.from(Object.values(BoatType).map((id) => ({ id })));
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex">
        <Select<string>
          items={boatTypeSelectItems}
          selectedValue={boatType}
          onChange={(val) => setBoatType(val as BoatType)}
          classNames="bg-white w-40 ml-1 border-primary py-2 px-4"
        />
      </div>
      <div className="w-full">
        <SessionBlockTeams
          boatType={boatType}
          ageClasses={ageClasses}
          teams={teamData}
          refetch={refetch}
        />
      </div>
    </>
  );
}

// const { source, destination } = result;
//
// // dropped outside the list
// if (!destination) {
//   return;
// }
// const sInd = +source.droppableId;
// const dInd = +destination.droppableId;
//
// if (sInd === dInd) {
//   const items = reorder(state[sInd], source.index, destination.index);
//   const newState = [...state];
//   newState[sInd] = items;
//   setState(newState);
// } else {
//   const result = move(state[sInd], state[dInd], source, destination);
//   const newState = [...state];
//   newState[sInd] = result[sInd];
//   newState[dInd] = result[dInd];
//
//   setState(newState.filter(group => group.length));
// }
