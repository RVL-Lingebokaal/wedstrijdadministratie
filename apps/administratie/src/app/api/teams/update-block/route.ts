import { NextRequest } from 'next/server';
import { UpdateBlockArgs } from '@models';
import { teamService } from '@services';
import { QUERY_PARAMS } from '@utils';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const args = (await req.json()) as UpdateBlockArgs;
  const team = await teamService.getTeam(args.teamId, wedstrijdId);

  if (!team) {
    return new Response(`Er bestaat geen team voor id: ${args.teamId}`, {
      status: 500,
    });
  }

  try {
    team.startNumber = undefined;

    await teamService.saveTeamBlock(team.id, args.destBlock);
  } catch (error: any) {
    let errorMessage;
    switch (error) {
      case 'PARTICIPANT_BLOCK':
        errorMessage = `Een van de deelnemers roeit of stuurt al in blok ${args.destBlock}.`;
        break;
      case 'HELM_BLOCK':
        errorMessage = `De stuur roeit of stuurt al in blok ${args.destBlock}.`;
        break;
      case 'BOAT_BLOCK':
        errorMessage = `De boot wordt al gebruikt in blok ${args.destBlock}.`;
        break;
    }

    if (errorMessage) {
      return Response.json({ errorMessage });
    }
    console.log(error);
    return Response.json({
      errorMessage: 'Er is een probleem met het updaten van dit team.',
    });
  }

  return Response.json({ success: true });
}
