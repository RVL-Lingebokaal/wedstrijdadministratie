import { useMemo } from "react";
import Groups from "../../public/groups.svg";
import Person from "../../public/person.svg";
import Rowing from "../../public/rowing.svg";
import Calendar from "../../public/calendar.svg";
import Image from "next/image";
import { Block } from "../components/molecules/block/Block.client";

export default function Home() {
  const elements = useMemo(() => {
    return [
      { bottom: "Deelnemers", title: "1566", icon: Person },
      { bottom: "Teams", title: "123", icon: Groups },
      { bottom: "Verenigingen", title: "23", icon: Rowing },
      { bottom: "Dagen", title: "152", icon: Calendar },
    ];
  }, []);

  return (
    <div>
      <h1 className="text-white text-7xl font-bold">RVL Lingebokaal</h1>
      <h2 className="text-white text-6xl">Tijdsregistratie </h2>
      <div className="flex flex-row gap-x-4 mt-48">
        {elements.map(({ title, bottom, icon }) => (
          <Block title={title} bottom={bottom} key={title} variant="small">
            <Image src={icon} alt={title} className="py-2" />
          </Block>
        ))}
      </div>
      <div className="mt-12">
        <Block variant="large">
          <p className="text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Block>
      </div>
    </div>
  );
}
