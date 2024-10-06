import { NextRequest } from 'next/server';
import { SaveStartNumberTime } from '@models';
import { timeService } from '@services';

export async function POST(req: NextRequest) {
  const args = (await req.json()) as SaveStartNumberTime;

  const result = await timeService.saveTime(args);
  console.log(result);

  return Response.json({ success: true });
}
