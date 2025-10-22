import { NextRequest, NextResponse } from 'next/server';
import { downloadService } from '@services';
// @ts-ignore
import { Buffer } from 'exceljs';
import { QUERY_PARAMS } from '@utils';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const wedstrijdId = searchParams.get(QUERY_PARAMS.wedstrijdId);

  if (!wedstrijdId) {
    return new Response('wedstrijdId is required', { status: 400 });
  }

  try {
    // Create a new Excel workbook
    let buffer: null | Buffer;
    buffer = await downloadService.getResultatenOverzicht(wedstrijdId);

    // Set response headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename=rugnummer.xlsx',
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
