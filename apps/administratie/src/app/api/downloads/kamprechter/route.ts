import { NextRequest, NextResponse } from 'next/server';
import { downloadService } from '@services';
import { QUERY_PARAMS } from '@utils';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const heat = searchParams.get(QUERY_PARAMS.heat);
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId || heat === null) {
    return new Response('wedstrijdId or heat is required', { status: 400 });
  }

  try {
    // Create a new Excel workbook
    const buffer = await downloadService.getKamprechterInfo(
      Number.parseInt(heat),
      wedstrijdId
    );

    // Set response headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename=kamprechters.xlsx',
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
