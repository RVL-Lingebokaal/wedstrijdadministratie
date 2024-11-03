import { NextRequest } from 'next/server';
import { settingsService } from '@services';

export async function POST(req: NextRequest) {
  const args = await req.json();
  await settingsService.removeClassItem(args);

  return Response.json({ success: true });
}
