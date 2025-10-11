import { NextRequest } from 'next/server';
import { wedstrijdService } from '@services';
import { createWedstrijdFormSchema } from '@models';

export async function POST(req: NextRequest) {
  const args = createWedstrijdFormSchema.safeParse(await req.json());

  if (!args.success) {
    return Response.json(
      { message: 'Invalid request', errors: args.error },
      { status: 400 }
    );
  }

  const dbWedstrijd = await wedstrijdService.upsertWedstrijd(args.data);

  return Response.json({ success: true, wedstrijdId: dbWedstrijd.id });
}
