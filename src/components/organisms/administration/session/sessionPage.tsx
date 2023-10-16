import { useMemo, useState } from "react";
import { useGetTeams } from "../../../../hooks/teams/useGetTeams";
import { useGetSettings } from "../../../../hooks/settings/useGetSettings";
import { LoadingSpinner } from "../../../atoms/loading-spinner/loadingSpinner";
import { Select } from "../../../atoms/select/select";
import { Team } from "../../../../models/team";
import { BoatType } from "../../../../models/settings";
import { SessionBlockTeams } from "../../../molecules/session-block-teams/sessionBlockTeams";

export default function SessionPage() {
  const [boatType, setBoatType] = useState<BoatType>(BoatType.skiff);
  const { data: teamData, isLoading } = useGetTeams();
  const { data: settingsData, refetch } = useGetSettings();

  const ageClasses = settingsData?.ages ?? [];

  const { blockTeams, totalBlocks } = useMemo(() => {
    const map = new Map<number, Map<BoatType, Team[]>>();
    if (!teamData || teamData.length === 0) {
      return {
        blockTeams: map,
        totalBlocks: new Map<number, number>([
          [1, 0],
          [2, 0],
          [3, 0],
        ]),
      };
    }

    const total = new Map<number, number>();
    const blocks = teamData.reduce((acc, team) => {
      const teamBoatType = team.getBoatType();
      if (!teamBoatType) {
        return acc;
      }

      const blockId = team.getBlock();

      let totalBlock = total.get(blockId);
      total.set(blockId, totalBlock ? ++totalBlock : 1);

      const boatTypes = acc.get(blockId);
      if (!boatTypes) {
        const types = new Map<BoatType, Team[]>();
        types.set(teamBoatType, [team]);
        return acc.set(blockId, types);
      }

      let teams = boatTypes.get(teamBoatType);
      if (!teams) {
        teams = [];
      }
      teams.push(team);

      boatTypes.set(teamBoatType, teams);
      return acc.set(blockId, boatTypes);
    }, map);
    return { blockTeams: blocks, totalBlocks: total };
  }, [teamData]);

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
        {[1, 2, 3].map((block) => (
          <SessionBlockTeams
            key={block}
            block={block}
            boatType={boatType}
            ageClasses={ageClasses}
            totalTeams={totalBlocks.get(block) ?? 0}
            teams={blockTeams.get(block)?.get(boatType)}
          />
        ))}
      </div>
    </>
  );
}
