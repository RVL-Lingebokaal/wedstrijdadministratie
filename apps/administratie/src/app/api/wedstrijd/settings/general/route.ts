import { NextRequest } from 'next/server';
import { QUERY_PARAMS } from '@utils';
import { saveGeneralSettingsSchema } from '@models';
import { wedstrijdService } from '@services';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  const body = await req.json();
  const parsedBody = saveGeneralSettingsSchema.safeParse(body);

  if (!parsedBody.success) {
    return new Response('Invalid body', { status: 400 });
  }

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  await wedstrijdService.saveGeneralSettings(wedstrijdId, parsedBody.data);

  return Response.json({ success: true });
}
