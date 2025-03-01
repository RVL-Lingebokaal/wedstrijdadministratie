import { NextRequest } from 'next/server';
import { TeamAddForm } from '@schemas';
import { participantService, settingsService, teamService } from '@services';
import { getAgeClassTeam, getBoatId } from '@models';

export async function POST(req: NextRequest) {
  const args = (await req.json()) as TeamAddForm;
  const settings = await settingsService.getSettings();
  const preferredBlock = parseInt(args.preferredBlock.toString());
  const helm = args.helm
    ? await participantService.createParticipant({
        ...args.helm,
        blocks: new Set([preferredBlock]),
      })
    : null;
  const participants = [];
  for await (const p of args.participants) {
    const participant = await participantService.createParticipant({
      ...p,
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
  };

  await teamService.saveTeam(team);
  return Response.json({ success: true });
}
