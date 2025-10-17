import {
  useGetClassMap,
  useGetGeneralSettings,
  useGetSettings,
  useGetTeams,
} from '@hooks';
import { LoadingSpinner } from '@components/server';
import {
  BoatType,
  boatTypes,
  Gender,
  genders,
  translateClass,
  WedstrijdIdProps,
} from '@models';
import { useMemo } from 'react';

export function StatisticsPage({ wedstrijdId }: WedstrijdIdProps) {
  const { data: teamData, isLoading: teamIsLoading } = useGetTeams(wedstrijdId);
  const { data: settingsData, isLoading: settingsIsLoading } =
    useGetSettings(wedstrijdId);
  const classMap = useGetClassMap(settingsData);
  const { data: generalSettingsData, isLoading: generalSettingsIsLoading } =
    useGetGeneralSettings(wedstrijdId);

  const { totalAmount, medals } = useMemo(() => {
    if (!teamData || !settingsData) return { totalAmount: 0, medals: [] };

    const boatMap = settingsData.boats.reduce((acc, boat) => {
      acc.set(boat.type, boat.price);
      return acc;
    }, new Map<BoatType, number>());
    let totalAmount = 0;
    const map = teamData.reduce(
      (acc, { ageClass, boatType, gender, participants, helm }) => {
        const key = JSON.stringify({ gender, boat: boatType });
        const classItems = classMap.get(key) ?? [];
        const ageClassItems = classItems.find((c) => c.ages.includes(ageClass));
        if (!ageClassItems) {
          return acc;
        }

        const keyClass = translateClass({
          gender,
          boatType,
          className: ageClassItems.name,
          isJeugdWedstrijd: generalSettingsData?.isJeugd ?? false,
        });
        const amount = (acc.get(keyClass)?.amount ?? 0) + 1;
        const totalPeople = participants.length + (helm ? 1 : 0);
        const price = boatMap.get(boatType) ?? '0';
        totalAmount = totalAmount + Number.parseInt(price as string);
        return acc.set(keyClass, { amount, totalPeople, boatType, gender });
      },
      new Map<
        string,
        {
          amount: number;
          totalPeople: number;
          boatType: BoatType;
          gender: Gender;
        }
      >()
    );
    const filtered = Array.from(map.keys()).reduce((acc, key) => {
      const data = map.get(key);

      if (!data) return acc;

      const { amount, totalPeople, boatType, gender } = data;

      if (amount < 2) return acc;

      const text =
        totalPeople === 1
          ? `Er is 1 medaille nodig met de tekst '${key}'`
          : `Er zijn ${totalPeople} medailles nodig met de tekst '${key}'`;
      acc.push({ text, boatType, gender });
      return acc;
    }, [] as { text: string; boatType: BoatType; gender: Gender }[]);
    const medals = filtered.sort(
      (a, b) =>
        boatTypes.indexOf(a.boatType) - boatTypes.indexOf(b.boatType) ||
        genders.indexOf(a.gender) - genders.indexOf(b.gender)
    );
    return { medals, totalAmount };
  }, [teamData, classMap, generalSettingsData]);

  if (teamIsLoading || settingsIsLoading || generalSettingsIsLoading) {
    return <LoadingSpinner />;
  }

  if (!teamData || !settingsData) {
    return 'Er is geen data gevonden';
  }

  return (
    <div className="px-4">
      <h1 className="font-bold text-2xl">Statistieken</h1>
      <p className="py-3">
        Hieronder staan de statistieken omtrent het totaal bedrag aan
        inschrijfgeld en de medailles die besteld moeten worden.
      </p>
      <h2 className="font-bold text-xl">Totaal bedrag</h2>
      <p className="py-3">{`Het totale bedrag aan inschrijfgeld is €${totalAmount},-`}</p>
      <h2 className="font-bold text-xl pb-3">Medailles</h2>
      {medals.map(({ text }) => (
        <div>{text}</div>
      ))}
    </div>
  );
}
