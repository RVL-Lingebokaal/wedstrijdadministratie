import { NextRequest } from 'next/server';
import { timeService } from '@services';

export async function POST(req: NextRequest) {
  const args = await req.json();

  await timeService.saveTime(args);

  return Response.json({ success: true });
}
