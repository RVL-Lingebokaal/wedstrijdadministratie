'use client';

import { Wedstrijd } from '@models';
import { useMemo, useState } from 'react';
import { Combobox, ComboxBoxItem } from '@components';
import { Button } from '@components/server';
import { useRouter } from 'next/navigation';

interface SelectWedstrijdProps {
  wedstrijden: Wedstrijd[];
}

export function SelectWedstrijd({ wedstrijden }: SelectWedstrijdProps) {
  const router = useRouter();
  const [selectedWedstrijd, setSelectedWedstrijd] = useState<Wedstrijd>(
    wedstrijden[0]
  );
  const { wedstrijdMap, comboValues } = useMemo(() => {
    const comboValues: ComboxBoxItem[] = [];
    const wedstrijdMap = wedstrijden.reduce((acc, wedstrijd) => {
      acc.set(wedstrijd.id, wedstrijd);
      comboValues.push({ value: wedstrijd.id, label: wedstrijd.name });
      return acc;
    }, new Map<string, Wedstrijd>());

    return { wedstrijdMap, comboValues };
  }, [wedstrijden]);

  return (
    <div className="flex gap-4 flex-col">
      <Combobox
        values={comboValues}
        selectedItem={{
          value: selectedWedstrijd.id,
          label: selectedWedstrijd.name,
        }}
        setSelectedItem={(item) =>
          item && setSelectedWedstrijd(wedstrijdMap.get(item.value)!)
        }
      />
      <Button
        name="Ga naar deze wedstrijd"
        color="secondary"
        onClick={() => router.push(`/wedstrijd/${selectedWedstrijd.id}`)}
      />
    </div>
  );
}
