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

export async function POST(req: NextRequest) {
  try {
    const stream = Readable.fromWeb(req.body as any);
    const allHeaders = headers();
    const busBoy = Busboy({
      headers: {
        'content-type': allHeaders.get('content-type') ?? 'multipart/form-data',
      },
    });
    busBoy.on('file', async function (_, stream: Stream) {
      await teamService.removeAllTeams();
      await participantService.removeAllParticipants();
      await boatService.removeAllBoats();

      const { teams, participants, boats } = await bondService.readBondFile(
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
