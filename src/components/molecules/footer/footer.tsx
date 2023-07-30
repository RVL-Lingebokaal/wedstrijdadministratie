import React from "react";
import { useRouter } from "next/router";

export function Footer() {
  const { pathname } = useRouter();

  return (
    <div className="bg-primary items-center flex flex-col h-40 text-white p-8 gap-x-3.5">
            <p className="text-2xl">RVL Lingebokaal Tijdsregistratie</p>
            <p className="text-xl">Copyright © 2023 RVL</p>
    </div>
  );
}
