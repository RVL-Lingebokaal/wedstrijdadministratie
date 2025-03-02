import { NextRequest, NextResponse } from 'next/server';
import { downloadService } from '@services';
// @ts-ignore
import { Buffer } from 'exceljs/index';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const sortByStartNumber = searchParams.get('sortByStartNumber') === 'true';
  try {
    // Create a new Excel workbook
    let buffer: null | Buffer = null;
    if (sortByStartNumber) {
      buffer = await downloadService.getBetalingenByStartNumber();
    } else {
      buffer = await downloadService.getBetalingenByVerenigingsNaam();
    }

    // Set response headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename=betalingen.xlsx',
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
