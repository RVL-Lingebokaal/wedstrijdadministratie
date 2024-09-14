import { NextRequest } from 'next/server';
import { ClassItem } from '@models';
import { settingsService } from '@services';

export async function POST(req: NextRequest) {
  const args = (await req.json()) as ClassItem;
  await settingsService.removeClassItem(args);

  return Response.json({ success: true });
}
