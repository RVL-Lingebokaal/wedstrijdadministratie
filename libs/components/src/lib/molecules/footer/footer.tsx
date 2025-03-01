import React from 'react';
import { DateTime } from 'luxon';

export function Footer() {
  return (
    <div className="bg-primary items-center flex flex-row h-12 text-white p-8 gap-x-3.5 justify-between">
      <p className="text-xl">RVL Lingebokaal Tijdsregistratie</p>
      <p className="text-sm">{`Copyright © ${DateTime.now().year} RVL`}</p>
    </div>
  );
}
