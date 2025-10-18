import { UploadButton, UploadData } from '@components';
import { getCounts } from '@services';

export default async function UploadPage({
  params: { id },
}: ParamsWithWedstrijdId) {
  const result = await getCounts(id);
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-primary mb-2">Upload</h1>
        <UploadData initialDataCounts={result} wedstrijdId={id} />
        <p className="mt-5 w-3/5">
          Upload hier het csv bestand van de bond. Alle data van teams,
          deelnemers en sessie indelingen zal worden verwijderd. De instellingen
          zoals correctiefactoren en klasse indelingen zullen wel blijven
          bestaan.
        </p>
      </div>
      <UploadButton wedstrijdId={id} />
    </div>
  );
}
