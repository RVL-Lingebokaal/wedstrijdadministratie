import { NextRequest, NextResponse } from 'next/server';
import { Time } from '@models';
import { timeService } from '@services';

export async function GET(req: NextRequest) {
  const acceptHeader = req.headers.get('accept');
  if (acceptHeader && acceptHeader.includes('text/event-stream')) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    };
    let responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    const sendUpdate = (data: Time[]) => {
      writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    };

    const unsubscribe = timeService.watchTimeUpdates(true, true, sendUpdate);

    req.signal.addEventListener('abort', () => {
      console.log('aborting');
      unsubscribe();
    });

    return new Response(responseStream.readable, { headers, status: 200 });
  } else {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const args = (await req.json()) as Time;

  await timeService.deleteTime(args);

  return NextResponse.json({ success: true });
}
