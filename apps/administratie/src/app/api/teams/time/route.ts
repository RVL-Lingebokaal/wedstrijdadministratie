import { NextRequest, NextResponse } from 'next/server';
import { PostTimeProps, Time } from '@models';
import { timeService } from '@services';
import { QUERY_PARAMS } from '@utils';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const isA = searchParams.get(QUERY_PARAMS.isA) === 'true';
  const isStart = searchParams.get(QUERY_PARAMS.isStart) === 'true';
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

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

    const unsubscribe = timeService.watchTimeUpdates(
      isA,
      isStart,
      sendUpdate,
      wedstrijdId
    );

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
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const args = (await req.json()) as PostTimeProps;

  if (args.type === 'delete') {
    await timeService.deleteTime(args);
  }

  if (args.type === 'restore') {
    if (!args.teamId || args.isA === undefined || args.isStart === undefined) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    await timeService.restoreTime(
      args.teamId,
      args.isA,
      args.isStart,
      wedstrijdId
    );
  }

  if (args.type === 'duplicate') {
    if (args.isA === undefined || args.isStart === undefined) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const timeResult = await timeService.addTime(
      args.time,
      args.isA,
      args.isStart,
      wedstrijdId
    );

    return NextResponse.json({ timeId: timeResult.id });
  }

  return NextResponse.json({ success: true });
}
