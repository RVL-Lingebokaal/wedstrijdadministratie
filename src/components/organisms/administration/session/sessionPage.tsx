import { useMemo, useState } from "react";
import { useGetTeams } from "../../../../hooks/teams/useGetTeams";
import { useGetSettings } from "../../../../hooks/settings/useGetSettings";
import { LoadingSpinner } from "../../../atoms/loading-spinner/loadingSpinner";
import { Select } from "../../../atoms/select/select";
import { BoatType } from "../../../../models/settings";
import { SessionBlockTeams } from "../../../molecules/session-block-teams/sessionBlockTeams";
import { useGetSessionTotals } from "../../../../hooks/useGetSessionTotals";

export default function SessionPage() {
  const [boatType, setBoatType] = useState<BoatType>(BoatType.scullTwoWithout);
  const { data: teamData, isLoading, refetch } = useGetTeams();
  const { data: settingsData } = useGetSettings();
  const { totalBlocks, blockTeams, boatTypes } = useGetSessionTotals(
    settingsData?.ages ?? [],
    teamData
  );

  const ageClasses = settingsData?.ages ?? [];

  const boatTypeSelectItems = useMemo(() => {
    return Array.from(boatTypes.values()).map((id) => ({ id }));
  }, [boatTypes]);

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
          totalBlocks={totalBlocks}
          blockTeams={blockTeams}
        />
      </div>
    </>
  );
}
