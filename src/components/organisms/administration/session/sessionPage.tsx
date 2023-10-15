import { useMemo, useState } from "react";
import { useGetTeams } from "../../../../hooks/teams/useGetTeams";
import { useGetSettings } from "../../../../hooks/settings/useGetSettings";
import { LoadingSpinner } from "../../../atoms/loading-spinner/loadingSpinner";
import { Select } from "../../../atoms/select/select";
import { Team } from "../../../../models/team";
import { GridHeader } from "../../../atoms/grid-header/gridHeader";
import { AgeItem, BoatType } from "../../../../models/settings";
import { GridRow } from "../../../atoms/grid-row/gridRow";

export default function SessionPage() {
  const [boatType, setBoatType] = useState<BoatType>(BoatType.skiff);
  const { data: teamData, isLoading } = useGetTeams();
  const { data: settingsData, refetch } = useGetSettings();

  const ageClasses = settingsData?.ages ?? [];

  const blockTeams = useMemo(() => {
    const map = new Map<number, Map<BoatType, Team[]>>();
    if (!teamData || teamData.length === 0) {
      return map;
    }
    return teamData.reduce((acc, team) => {
      const teamBoatType = team.getBoatType();
      if (!teamBoatType) {
        return acc;
      }

      const blockId = team.getBlock();
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
        {getBlockTeams(blockTeams, 1, boatType, ageClasses)}
        {getBlockTeams(blockTeams, 2, boatType, ageClasses)}
        {getBlockTeams(blockTeams, 3, boatType, ageClasses)}
      </div>
    </>
  );
}

function getBlockTeams(
  blockTeams: Map<number, Map<BoatType, Team[]>>,
  block: number,
  boatType: BoatType,
  ageClasses: AgeItem[]
) {
  return blockTeams
    .get(block)
    ?.get(boatType)
    ?.map((team, index) => (
      <>
        <div className="flex">
          <GridHeader
            key={team.getId()}
            needsRounding={index === 0}
            items={[
              team.getAgeClass(ageClasses),
              team.getBoatType() ?? "",
              team.getClub(),
              team.getHelm()?.getName() ?? team.getParticipants()[0].getName(),
            ]}
            classNames="w-4/5"
          />
        </div>
        {team.getRemarks() && (
          <GridRow items={[{ node: team.getRemarks() }]} classNames="w-4/5" />
        )}
      </>
    ));
}
