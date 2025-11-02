import { NextRequest } from 'next/server';
import { wedstrijdService } from '@services';
import { QUERY_PARAMS } from '@utils';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const args = await req.json();
  await wedstrijdService.removeClassItem(wedstrijdId, args);

  return Response.json({ success: true });
}
