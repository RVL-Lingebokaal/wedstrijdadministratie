import { NextRequest } from 'next/server';
import { addTeamSchema } from '@schemas';
import {
  boatService,
  participantService,
  teamService,
  wedstrijdService,
} from '@services';
import { getAgeClassTeam, getBoatId } from '@models';
import { QUERY_PARAMS } from '@utils';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId or type is required', { status: 400 });
  }

  const { success, data, error } = addTeamSchema.safeParse(await req.json());

  if (!success) {
    return new Response(`Invalid request data: ${error}`, { status: 400 });
  }
  const { name, club, boat: boatName, preferredBlock, boatType, gender } = data;
  const settings = await wedstrijdService.getSettingsFromWedstrijd(wedstrijdId);

  const helm = data.helm
    ? await participantService.createParticipant({
        ...data.helm,
        wedstrijdId,
        block: preferredBlock,
      })
    : null;
  const participants = [];
  for await (const p of data.participants) {
    const participant = await participantService.createParticipant({
      ...p,
      wedstrijdId,
      block: preferredBlock,
    });
    participants.push(participant);
  }
  const ageClass = getAgeClassTeam({ ages: settings.ages, participants });
  //TODO: add boat creation to boatService
  const boatId = getBoatId(boatName, club);
  let boat = await boatService.getBoatById(boatId, wedstrijdId);

  if (boat) {
    boat = boatService.getBoatWithNewBlock(boat, preferredBlock);
  }

  const team = {
    ageClass,
    name,
    id: '',
    club,
    boat: boat
      ? boat
      : {
          name: boatName,
          club,
          blocks: new Set([preferredBlock]),
          id: boatId,
          wedstrijdId,
        },
    registrationFee: await wedstrijdService.getRegistrationFee(
      boatType,
      wedstrijdId
    ),
    preferredBlock,
    coach: '',
    phoneNumber: '',
    remarks: '',
    boatType: boatType,
    gender: gender,
    helm,
    participants,
    place: 0,
    wedstrijdId,
    block: preferredBlock,
  };

  await teamService.saveTeam(team);
  return Response.json({ success: true });
}
