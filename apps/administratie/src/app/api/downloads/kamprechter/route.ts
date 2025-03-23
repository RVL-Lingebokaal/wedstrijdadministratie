import { NextRequest, NextResponse } from 'next/server';
import { downloadService } from '@services';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const heat = searchParams.get('heat');

  if (heat === null) {
    throw new Error('A heat is necessary to generate the excel file');
  }

  try {
    // Create a new Excel workbook
    const buffer = await downloadService.getKamprechterInfo(
      Number.parseInt(heat)
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
