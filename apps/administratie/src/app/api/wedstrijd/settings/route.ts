import { NextRequest } from 'next/server';
import { QUERY_PARAMS } from '@utils';
import { wedstrijdService } from '@services';
import { saveSettingsSchema } from '@models';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get(QUERY_PARAMS.type);
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!type || !wedstrijdId) {
    return new Response('wedstrijdId or type is required', { status: 400 });
  }

  const wedstrijdSettings = await wedstrijdService.getSettingsFromWedstrijd(
    wedstrijdId
  );

  if (type === 'general') {
    return Response.json({
      ...wedstrijdSettings.general,
    });
  }

  return Response.json({
    boats: wedstrijdSettings.boats ?? [],
    ages: wedstrijdSettings.ages ?? [],
    classes: wedstrijdSettings.classes ?? [],
  });
}

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  const body = await req.json();
  const parsedBody = saveSettingsSchema.safeParse(body);

  if (!parsedBody.success) {
    return new Response('Invalid body', { status: 400 });
  }

  await wedstrijdService.saveSettingsToWedstrijd(wedstrijdId, parsedBody.data);

  return Response.json({ success: true });
}
