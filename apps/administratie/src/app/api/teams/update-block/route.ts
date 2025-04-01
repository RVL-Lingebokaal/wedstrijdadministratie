import { NextRequest } from 'next/server';
import { UpdateBlockArgs } from '@models';
import { teamService } from '@services';

export async function POST(req: NextRequest) {
  const args = (await req.json()) as UpdateBlockArgs;
  const team = await teamService.getTeam(args.teamId);

  if (!team) {
    return new Response(`Er bestaat geen team voor id: ${args.teamId}`, {
      status: 500,
    });
  }

  try {
    team.block = args.destBlock;
    team.startNumber = undefined;
    console.log(JSON.stringify(team.participants));

    await teamService.saveTeam(team);
  } catch (error: any) {
    let errorMessage;
    switch (error.name) {
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
    return Response.json({
      errorMessage: 'Er is een probleem met het updaten van dit team.',
    });
  }

  return Response.json({ success: true });
}
