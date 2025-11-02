import { NextRequest } from 'next/server';
import { timeService } from '@services';
import { QUERY_PARAMS } from '@utils';
import { postResultsForTeamSchema } from '@models';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const args = postResultsForTeamSchema.safeParse(await req.json());

  if (!args.success) {
    return new Response(`Invalid request data: ${args.error}`, { status: 400 });
  }

  await timeService.addChoice(args.data, wedstrijdId);

  return Response.json({ success: true });
}
