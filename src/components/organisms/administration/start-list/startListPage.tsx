import { BoatType } from "../../../../models/settings";
import { useGetSettings } from "../../../../hooks/settings/useGetSettings";
import { useGetTeams } from "../../../../hooks/teams/useGetTeams";
import { LoadingSpinner } from "../../../atoms/loading-spinner/loadingSpinner";
import { useGetSessionTotals } from "../../../../hooks/useGetSessionTotals";
import { GridHeader } from "../../../atoms/grid-header/gridHeader";
import { Team } from "../../../../models/team";
import { StartListGridRow } from "./startListGridRow";

const StartListOrder = [
  BoatType.boardEightWith,
  BoatType.scullFourWith,
  BoatType.scullTwoWithout,
  BoatType.scullFourWithC,
  BoatType.skiff,
];
const GridHeaderItems = [
  { node: "Startnr" },
  { node: "Blok" },
  { node: "Veld" },
  { node: "Ploegnaam", classNames: "col-span-2" },
  { node: "Slag", classNames: "col-span-2" },
  { node: "Boot", classNames: "col-span-2" },
  { node: "ID" },
];

export default function StartListPage() {
  const { data: settingsData, isLoading: isLoadingSettings } = useGetSettings();
  const { data: teamData, isLoading: isLoadingTeams } = useGetTeams();

  const { blockTeams } = useGetSessionTotals({
    ageItems: settingsData?.ages ?? [],
    teams: teamData,
    sortArrayBoatTypes: StartListOrder,
  });

  if (isLoadingSettings || isLoadingTeams) {
    return <LoadingSpinner />;
  }

  const ageItems = settingsData?.ages ?? [];
  let lastStartNumber = -1;

  return (
    <div>
      <GridHeader
        needsRounding
        items={GridHeaderItems}
        itemsCount={10}
        classNames="-mb-3"
      />
      {[1, 2, 3].map((block) => {
        return StartListOrder.map((boatType) => {
          const teams = blockTeams.get(block)?.get(boatType);
          if (!teams) {
            return undefined;
          }

          return teams.map((team, index) => {
            const { needsPaddingTop, startPlace } = getStartPlace({
              team,
              previousTeam: index === 0 ? undefined : teams[index - 1],
              startPlace: lastStartNumber,
            });
            lastStartNumber = startPlace;

            return (
              <StartListGridRow
                key={team.getId()}
                team={team}
                startNumber={lastStartNumber}
                ageItems={ageItems}
                needsPaddingTop={needsPaddingTop}
              />
            );
          });
        });
      })}
    </div>
  );
}

interface GetStartPlaceProps {
  team: Team;
  previousTeam?: Team;
  startPlace: number;
}

function getStartPlace({ team, previousTeam, startPlace }: GetStartPlaceProps) {
  const teamStartPlace = team.getStartPlace();

  if (!previousTeam) {
    return {
      startPlace: teamStartPlace ?? 2 + startPlace,
      needsPaddingTop: true,
    };
  }

  const currentBoatType = team.getBoatType();
  const previousBoatType = previousTeam.getBoatType();
  const currentGender = team.getGender();
  const previousGender = previousTeam.getGender();

  if (teamStartPlace) {
    return { startPlace: teamStartPlace, needsPaddingTop: false };
  }

  if (
    currentBoatType === previousBoatType &&
    currentGender === previousGender
  ) {
    return { startPlace: ++startPlace, needsPaddingTop: false };
  } else {
    return { startPlace: 2 + startPlace, needsPaddingTop: true };
  }
}
