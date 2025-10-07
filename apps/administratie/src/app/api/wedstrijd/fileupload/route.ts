import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import Busboy from 'busboy';
import { Readable, Stream } from 'stream';
import {
  boatService,
  bondService,
  participantService,
  teamService,
} from '@services';
import { QUERY_PARAMS } from '@utils';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId or type is required', { status: 400 });
  }

  try {
    const stream = Readable.fromWeb(req.body as any);
    const allHeaders = headers();
    const busBoy = Busboy({
      headers: {
        'content-type': allHeaders.get('content-type') ?? 'multipart/form-data',
      },
    });
    busBoy.on('file', async function (_, stream: Stream) {
      await teamService.removeAllTeams(wedstrijdId);
      await participantService.removeAllParticipants(wedstrijdId);
      await boatService.removeAllBoats(wedstrijdId);

      const { teams, participants, boats } = await bondService.readBondFile(
        wedstrijdId,
        stream
      );

      await teamService.saveTeams(teams);
      await participantService.saveParticipants(participants);
      await boatService.saveBoats(boats);
    });
    busBoy.on('close', () => console.log('done processing'));

    stream.pipe(busBoy);
  } catch (e) {
    console.error(e);
  }

  return Response.json({ success: true });
}
