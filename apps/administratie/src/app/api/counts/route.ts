import { QUERY_PARAMS } from '@utils';
import { NextRequest } from 'next/server';
import { getCounts } from '@services';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const result = await getCounts(wedstrijdId);

  return Response.json(result);
}
