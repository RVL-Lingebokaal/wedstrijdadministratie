import { Button } from "../../components/atoms/button/button";
import { useState } from "react";
import { TypesForm } from "../../components/organisms/settings/types/typesForm";

enum Tabs {
  type = "Boottype",
  leeftijd = "Leeftijd",
  ploeg = "Ploeg",
  instellingen = "Instellingen",
  gebruikers = "Gebruikers",
}

export default function Settings() {
  const [tab, setTab] = useState(Tabs.type);

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
      {tab === Tabs.type && <TypesForm />}
    </div>
  );
}
