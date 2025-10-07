import { UploadButton } from '@components';
import { participantService, teamService } from '@services';

export default async function UploadPage({
  params: { id },
}: ParamsWithWedstrijdId) {
  const teams = await teamService.getTeams(id);
  const participants = await participantService.getParticipants(id);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-primary mb-2">Upload</h1>
        <p>{`Er zijn op dit moment ${teams.length} teams en ${participants.size} deelnemers ingeschreven.`}</p>
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
