import { teamService } from '@services';

export async function GET() {
  const result = await teamService.getResults();
  // console.log({ result });

  return Response.json(result);
}
