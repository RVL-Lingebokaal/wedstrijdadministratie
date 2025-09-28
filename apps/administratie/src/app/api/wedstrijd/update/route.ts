import { NextRequest } from 'next/server';
import { wedstrijdService } from '@services';
import { wedstrijdSchema } from '@models';

export async function POST(req: NextRequest) {
  const args = wedstrijdSchema.safeParse(await req.json());
  if (!args.success) {
    return Response.json(
      { message: 'Invalid request', errors: args.error },
      { status: 400 }
    );
  }

  await wedstrijdService.upsertWedstrijd(args.data);

  return Response.json({ success: true });
}
