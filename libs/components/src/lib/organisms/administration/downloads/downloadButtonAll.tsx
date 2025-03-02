import { useDownload } from '@hooks';
import { Button } from '@components/server';

export function DownloadButtonAll() {
  const downloadBetalingenStartNummer = useDownload({
    url: '/api/downloads/betalingen?sortByStartNumber=true',
    fileName: 'betalingenPerStartnummer.xlsx',
  });
  const downloadBetalingenVerenigingsNaam = useDownload({
    url: '/api/downloads/betalingen?sortByStartNumber=false',
    fileName: 'betalingenPerVerenigingsNaam.xlsx',
  });
  const downloadRugnummerStartNummer = useDownload({
    url: '/api/downloads/rugnummer?sortByStartNumber=true',
    fileName: 'rugnummerPerStartnummer.xlsx',
  });
  const downloadRugnummerVerenigingsNaam = useDownload({
    url: '/api/downloads/rugnummer?sortByStartNumber=false',
    fileName: 'rugnummerPerVerenigingsNaam.xlsx',
  });
  const downloadBootControle = useDownload({
    url: '/api/downloads/bootcontrole',
    fileName: 'bootcontrole.xlsx',
  });

  const downloadButtons = [
    {
      click: downloadBetalingenStartNummer,
      name: 'Betalingen per startnummer',
    },
    {
      click: downloadBetalingenVerenigingsNaam,
      name: 'Betalingen per verenigingsnaam',
    },
    { click: downloadRugnummerStartNummer, name: 'Rugnummer per startnummer' },
    {
      click: downloadRugnummerVerenigingsNaam,
      name: 'Rugnummer per verenigingsnaam',
    },
    { click: downloadBootControle, name: 'Bootcontrole' },
  ];

  return (
    <>
      {downloadButtons.map(({ click, name }) => (
        <Button
          key={name}
          onClick={click}
          name={name}
          color="secondary"
          classNames="w-fit"
        />
      ))}
    </>
  );
}
