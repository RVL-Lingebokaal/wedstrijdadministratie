import { useDownload } from '@hooks';
import { Button } from '@components/server';
import { QUERY_PARAMS } from '@utils';
import { WedstrijdIdProps } from '@models';

export function DownloadButtonAll({ wedstrijdId }: WedstrijdIdProps) {
  const downloadBetalingenStartNummer = useDownload({
    url: `/api/downloads/betalingen?${QUERY_PARAMS.sortByStartNumber}=true&${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
    fileName: 'betalingenPerStartnummer.xlsx',
  });
  const downloadBetalingenVerenigingsNaam = useDownload({
    url: `/api/downloads/betalingen?${QUERY_PARAMS.sortByStartNumber}=false&${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
    fileName: 'betalingenPerVerenigingsNaam.xlsx',
  });
  const downloadRugnummerStartNummer = useDownload({
    url: `/api/downloads/rugnummer?${QUERY_PARAMS.sortByStartNumber}=true&${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
    fileName: 'rugnummerPerStartnummer.xlsx',
  });
  const downloadRugnummerVerenigingsNaam = useDownload({
    url: `/api/downloads/rugnummer?${QUERY_PARAMS.sortByStartNumber}=false&${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
    fileName: 'rugnummerPerVerenigingsNaam.xlsx',
  });
  const downloadBootControle = useDownload({
    url: `/api/downloads/bootcontrole?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
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
