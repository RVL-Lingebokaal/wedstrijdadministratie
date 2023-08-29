import { Button } from "../../components/atoms/button/button";
import { useState } from "react";
import { TypesForm } from "../../components/organisms/settings/types/typesForm";
import { AgesForm } from "../../components/organisms/settings/age/ageForm";
import { useRetrieveSettings } from "../../hooks/useRetrieveSettings";
import { FaSpinner } from "react-icons/fa";

enum Tabs {
  type = "Boottype",
  leeftijd = "Leeftijd",
  ploeg = "Ploeg",
  instellingen = "Instellingen",
  gebruikers = "Gebruikers",
}

export default function Settings() {
  const { data, isLoading } = useRetrieveSettings();
  const [tab, setTab] = useState(Tabs.type);

  if (isLoading || !data) {
    return <FaSpinner className="animate-spin text-brand-blue-500" />;
  }

  return (
    <div className="flex">
      <div className="flex flex-col gap-3">
        {Object.values(Tabs).map((val) => (
          <Button
            key={val}
            name={val}
            color={val === tab ? "highlight" : "primary"}
            onClick={() => setTab(val)}
          />
        ))}
      </div>
      {tab === Tabs.type && <TypesForm initialValues={{ items: data.boats }} />}
      {tab === Tabs.leeftijd && (
        <AgesForm initialValues={{ items: data.ages }} />
      )}
    </div>
  );
}
