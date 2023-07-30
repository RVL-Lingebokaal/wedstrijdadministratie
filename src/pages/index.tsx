import { useMemo } from "react";
import Groups from "../../public/groups.svg";
import Person from "../../public/person.svg";
import Rowing from "../../public/rowing.svg";
import Calendar from "../../public/calendar.svg";
import Image from "next/image";

export default function Home() {
  const elements = useMemo(() => {
    return [
      { text: "Deelnemers", number: 1566, icon: Person },
      { text: "Teams", number: 123, icon: Groups },
      { text: "Verenigingen", number: 23, icon: Rowing },
      { text: "Dagen", number: 152, icon: Calendar },
    ];
  }, []);

  return (
    <div>
      <h1 className="text-white text-7xl font-bold">RVL Lingebokaal</h1>
      <h2 className="text-white text-6xl">Tijdsregistratie </h2>
      <div className="flex flex-row gap-x-4">
        {elements.map(({ text, number, icon }) => (
          <div
            className="place-items-center flex flex-col border-4 border-secondary bg-white flex-1 p-3"
            key={text}
          >
            <h4 className="text-4xl font-extrabold">{text}</h4>
            <Image src={icon} alt={text} />
            <p className="text-3xl">{number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
