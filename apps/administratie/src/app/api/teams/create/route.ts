import { NextRequest } from 'next/server';
import { TeamAddForm } from '@schemas';
import { participantService, teamService, wedstrijdService } from '@services';
import { getAgeClassTeam, getBoatId } from '@models';
import { QUERY_PARAMS } from '@utils';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId or type is required', { status: 400 });
  }

  const args = (await req.json()) as TeamAddForm;
  const settings = await wedstrijdService.getSettingsFromWedstrijd(wedstrijdId);
  const preferredBlock = parseInt(args.preferredBlock.toString());
  const helm = args.helm
    ? await participantService.createParticipant({
        ...args.helm,
        wedstrijdId,
        blocks: new Set([preferredBlock]),
      })
    : null;
  const participants = [];
  for await (const p of args.participants) {
    const participant = await participantService.createParticipant({
      ...p,
      wedstrijdId,
      blocks: new Set([preferredBlock]),
    });
    participants.push(participant);
  }
  const ageClass = getAgeClassTeam({ ages: settings.ages, participants });
  const team = {
    ageClass,
    name: args.name,
    id: '',
    club: args.club,
    boat: {
      name: args.boat,
      club: args.club,
      blocks: new Set([args.preferredBlock]),
      id: getBoatId(args.boat, args.club),
      wedstrijdId,
    },
    registrationFee: 0,
    preferredBlock: parseInt(args.preferredBlock.toString()),
    coach: '',
    phoneNumber: '',
    remarks: '',
    boatType: args.boatType,
    gender: args.gender,
    helm,
    participants,
    place: 0,
    wedstrijdId,
  };

  await teamService.saveTeam(team);
  return Response.json({ success: true });
}
