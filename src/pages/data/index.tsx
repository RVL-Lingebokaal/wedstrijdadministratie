import { useEffect, useState } from "react";
import { Ploeg } from "../../models/ploeg";

let shouldLoad = true;

export default function Data() {
  const [ploegen, setPloegen] = useState<Ploeg[]>([]);

  useEffect(() => {
    if (shouldLoad) {
      shouldLoad = false;
      fetch("/api/ploegen")
        .then((response) => {
          return response.json();
        })
        .then((ploegen: Ploeg[]) => {
          setPloegen(ploegen);
        });
    }
  });

  return (
    <div>
      <h1>Data</h1>

      <h2>Ploegen</h2>
      {ploegen.map(({ name }) => (
        <div key={name}>
          <p>{name}</p>
        </div>
      ))}
    </div>
  );
}
