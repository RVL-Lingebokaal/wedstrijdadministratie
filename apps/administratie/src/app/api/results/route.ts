import { teamService } from '@services';

export async function GET() {
  const result = await teamService.getResults();

  return Response.json(result);
}
