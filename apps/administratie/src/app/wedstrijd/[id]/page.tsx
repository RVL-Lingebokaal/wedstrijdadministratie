import { Block, WedstrijdHomeElements } from '@components';
import { participantService, teamService, wedstrijdService } from '@services';

interface HomePageProps {
  params: { id: string };
}

export default async function Homepage({ params: { id } }: HomePageProps) {
  const teams = await teamService.getTeams();
  const participants = await participantService.getParticipants();
  const clubs = Array.from(teams.values()).reduce<Set<string>>(
    (acc, team) => acc.add(team.club),
    new Set()
  );
  const wedstrijd = await wedstrijdService.getWedstrijdById(id);

  return (
    <div>
      <h1 className="text-white text-6xl font-bold">{wedstrijd.name}</h1>
      <WedstrijdHomeElements
        data={{
          teamsSize: teams.size,
          participantsSize: participants.size,
          clubsSize: clubs.size,
          date: wedstrijd.date,
        }}
      />
      <div className="mt-12">
        <Block variant="large">
          <p className="text-xl">{wedstrijd.description}</p>
        </Block>
      </div>
    </div>
  );
}
