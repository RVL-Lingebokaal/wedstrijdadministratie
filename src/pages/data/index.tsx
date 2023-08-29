import { useEffect, useState } from "react";
import { Team } from "../../models/team";

let shouldLoad = true;

export default function Data() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (shouldLoad) {
      shouldLoad = false;
      fetch("/api/ploegen")
        .then((response) => {
          return response.json();
        })
        .then((teams: Team[]) => {
          setTeams(teams);
        });
    }
  });

  return (
    <div>
      <h1>Data</h1>

      <h2>Ploegen</h2>
      {teams.map((team) => (
        <div key={team.getName()}>
          <p>{team.getName()}</p>
        </div>
      ))}
    </div>
  );
}
