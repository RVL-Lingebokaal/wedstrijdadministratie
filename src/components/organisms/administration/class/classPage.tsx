import { Disclosure } from "@headlessui/react";
import { GridHeader } from "../../../atoms/grid-header/gridHeader";
import { BoatTypes } from "../../../../models/settings";
import { getGroups } from "../../../utils/teamUtils";
import { useMemo } from "react";
import { useGetTeams } from "../../../../hooks/useGetTeams";
import { useGetSettings } from "../../../../hooks/useGetSettings";
import { ClassSection } from "../../../molecules/class-section/classSection";

export default function ClassPage() {
  const { data: teamData, isLoading } = useGetTeams();
  const { data: settingsData } = useGetSettings();
  const groups = useMemo(() => getGroups(teamData ?? []), [teamData]);

  return (
    <div className="w-1/2">
      {Object.values(BoatTypes).map((val, index) => (
        <Disclosure key={val}>
          <Disclosure.Button className="w-full">
            <GridHeader
              items={[
                val,
                `${groups.get(val)?.length ?? 0} inschrijvingen`,
                "1 groep",
              ]}
              needsRounding={index === 0}
            />
          </Disclosure.Button>
          <Disclosure.Panel>
            <ClassSection
              teams={groups.get(val) ?? []}
              ages={settingsData?.ages ?? []}
            />
          </Disclosure.Panel>
        </Disclosure>
      ))}
    </div>
  );
}
