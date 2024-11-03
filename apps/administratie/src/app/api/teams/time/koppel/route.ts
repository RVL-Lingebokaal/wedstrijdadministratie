import { NextRequest } from 'next/server';
import { timeService } from '@services';

export async function POST(req: NextRequest) {
  const args = await req.json();

  const result = await timeService.saveTime(args);
  console.log(result);

  return Response.json({ success: true });
}
