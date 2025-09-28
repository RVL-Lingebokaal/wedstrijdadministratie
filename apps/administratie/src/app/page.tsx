import { Metadata } from 'next';
import { wedstrijdService } from '@services';
import { SelectWedstrijd } from '@components';

export const metadata: Metadata = {
  title: 'Lingebokaal administratie',
  description: 'Lingebokaal administratie',
  icons: '/rvl_logo_small.png',
};

export default async function Home() {
  const wedstrijden = await wedstrijdService.getWedstrijden();

  return (
    <div>
      <h1 className="text-white text-7xl font-bold">Wedstrijdadministratie</h1>
      <p className="text-white text-xl mt-5">
        Welkom op de website van de wedstrijdadminsitratie. Klik hieronder op de
        wedstrijd die je wil bekijken.
      </p>
      <div className="max-w-sm mt-10">
        {wedstrijden.length > 0 && (
          <SelectWedstrijd wedstrijden={wedstrijden} />
        )}
      </div>
    </div>
  );
}
