import { NextRequest } from 'next/server';
import { UpdateTeamArgs } from '@hooks';
import {
  boatService,
  participantService,
  teamService,
  wedstrijdService,
} from '@services';
import { getAgeClassTeam, getBoatId, Participant } from '@models';
import { QUERY_PARAMS } from '@utils';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }
  const settings = await wedstrijdService.getSettingsFromWedstrijd(wedstrijdId);
  const args = (await req.json()) as UpdateTeamArgs;
  let team = args.teamId
    ? await teamService.getTeam(args.teamId, wedstrijdId)
    : undefined;

  if (!team) {
    return new Response(`Er bestaat geen team voor id: ${args.teamId}`, {
      status: 500,
    });
  }
  let participantsMap = await participantService.getParticipants(wedstrijdId);
  const boats = await boatService.getBoats(wedstrijdId);
  let boat = boats.get(args.boat);
  const currentParticipants = [...participantsMap.values()];
  const newParticipants = args.participants.reduce((parts, p, index) => {
    if ((p.id && !participantsMap.has(p.id)) || !p.id) {
      const findOne = currentParticipants.find(
        (cp) => cp.name === p.name && cp.birthYear.toString() === p.birthYear
      );
      if (!findOne) {
        const newPart: Participant = {
          id: '',
          name: p.name,
          birthYear: parseInt(p.birthYear),
          wedstrijdId,
          club: p.club,
          blocks: new Set([args.preferredBlock]),
        };
        parts.push(newPart);
      } else {
        args.participants[index] = { ...p, id: findOne.id };
      }
    }
    return parts;
  }, [] as Participant[]);

  if (
    args.helm &&
    (!args.helm.id || (args.helm.id && !participantsMap.has(args.helm.id)))
  ) {
    const findHelm = currentParticipants.find(
      (cp) =>
        cp.name === args.helm?.name &&
        cp.birthYear.toString() === args.helm?.birthYear
    );
    if (!findHelm) {
      const newHelm: Participant = {
        id: '',
        name: args.helm.name,
        birthYear: parseInt(args.helm.birthYear),
        wedstrijdId,
        club: args.helm.club,
        blocks: new Set([args.preferredBlock]),
      };
      newParticipants.push(newHelm);
    } else {
      args.helm = { ...args.helm, id: findHelm.id };
    }
  }

  if (newParticipants.length > 0) {
    const parts = await Promise.all(
      newParticipants.map((p) =>
        participantService.createParticipant({
          name: p.name,
          birthYear: p.birthYear.toString(),
          club: p.club,
          block: args.preferredBlock,
          wedstrijdId,
        })
      )
    );
    console.log(parts);
    participantsMap = await participantService.getParticipants(wedstrijdId);
  }

  if (args.boat && !boat) {
    boat = {
      name: args.boat,
      club: team.club,
      blocks: new Set([args.preferredBlock]),
      id: getBoatId(args.boat, team.club),
      wedstrijdId,
    };
    await boatService.saveBoats([boat]);
  }
  const participants =
    args.participants?.map((p) => ({
      ...p,
      ...(participantsMap.get(p.id ?? '') as Participant),
    })) ?? team.participants;
  team = {
    ...team,
    ...args,
    boat: boat ?? null,
    helm: participantsMap.get(args.helm?.id ?? '') ?? null,
    participants,
    ageClass: getAgeClassTeam({ ages: settings.ages, participants }),
  };
  await teamService.saveTeam(team);

  return Response.json({ success: true });
}
